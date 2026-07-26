import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import {
  createInstituteEventRequest,
  deleteInstituteEventRequest,
  getInstituteEventsRequest,
  toggleInstituteEventStatusRequest,
  updateInstituteEventRequest
} from '../../api/instituteAdminEvents.js';

const EVENT_TYPES = ['WEBINAR', 'WORKSHOP', 'MEETUP', 'PLACEMENT_DRIVE', 'ALUMNI_TALK', 'NETWORKING', 'OTHER'];
const MODES = ['ONLINE', 'OFFLINE', 'HYBRID'];
const AUDIENCES = ['STUDENTS', 'ALUMNI', 'BOTH'];

const INITIAL_FORM = {
  title: '',
  description: '',
  eventType: 'WEBINAR',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  mode: 'ONLINE',
  meetingLink: '',
  audience: 'BOTH'
};

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadEvents = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getInstituteEventsRequest();
      setEvents(response.data?.events || []);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to load events.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setActiveId(editingId || 'creating');

    try {
      const response = editingId
        ? await updateInstituteEventRequest(editingId, formData)
        : await createInstituteEventRequest(formData);

      const savedEvent = response.data?.event;

      if (savedEvent) {
        setEvents((current) =>
          editingId ? current.map((item) => (item._id === savedEvent._id ? savedEvent : item)) : [savedEvent, ...current]
        );
      }

      setSuccessMessage(response.message || 'Event saved successfully.');
      resetForm();
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to save event.');
    } finally {
      setActiveId('');
    }
  };

  const handleEdit = (eventItem) => {
    setEditingId(eventItem._id);
    setFormData({
      title: eventItem.title,
      description: eventItem.description,
      eventType: eventItem.eventType,
      date: toDateInput(eventItem.date),
      startTime: eventItem.startTime,
      endTime: eventItem.endTime,
      location: eventItem.location,
      mode: eventItem.mode,
      meetingLink: eventItem.meetingLink || '',
      audience: eventItem.audience
    });
  };

  const handleToggle = async (eventId) => {
    setActiveId(eventId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await toggleInstituteEventStatusRequest(eventId);
      const updatedEvent = response.data?.event;

      if (updatedEvent) {
        setEvents((current) => current.map((item) => (item._id === updatedEvent._id ? updatedEvent : item)));
      }

      setSuccessMessage(response.message || 'Event status updated successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to update event status.');
    } finally {
      setActiveId('');
    }
  };

  const handleDelete = async (eventId) => {
    setActiveId(eventId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await deleteInstituteEventRequest(eventId);
      setEvents((current) => current.filter((item) => item._id !== eventId));
      if (editingId === eventId) {
        resetForm();
      }
      setSuccessMessage(response.message || 'Event deleted successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to delete event.');
    } finally {
      setActiveId('');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Events"
        description="Create and manage institute events for students, alumni, or both audiences."
      />

      <section className="surface-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title">Title</label>
              <input id="title" name="title" disabled={Boolean(activeId)} value={formData.title} onChange={handleChange} className="field-control" />
            </div>
            <div>
              <label htmlFor="eventType">Event type</label>
              <select id="eventType" name="eventType" disabled={Boolean(activeId)} value={formData.eventType} onChange={handleChange} className="field-control">
                {EVENT_TYPES.map((eventType) => <option key={eventType} value={eventType}>{eventType}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" disabled={Boolean(activeId)} value={formData.description} onChange={handleChange} rows="4" className="field-control" />
            </div>
            <div>
              <label htmlFor="date">Date</label>
              <input id="date" name="date" type="date" disabled={Boolean(activeId)} value={formData.date} onChange={handleChange} className="field-control" />
            </div>
            <div>
              <label htmlFor="startTime">Start time</label>
              <input id="startTime" name="startTime" disabled={Boolean(activeId)} value={formData.startTime} onChange={handleChange} className="field-control" placeholder="10:00 AM" />
            </div>
            <div>
              <label htmlFor="endTime">End time</label>
              <input id="endTime" name="endTime" disabled={Boolean(activeId)} value={formData.endTime} onChange={handleChange} className="field-control" placeholder="12:00 PM" />
            </div>
            <div>
              <label htmlFor="location">Location</label>
              <input id="location" name="location" disabled={Boolean(activeId)} value={formData.location} onChange={handleChange} className="field-control" />
            </div>
            <div>
              <label htmlFor="mode">Mode</label>
              <select id="mode" name="mode" disabled={Boolean(activeId)} value={formData.mode} onChange={handleChange} className="field-control">
                {MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="audience">Audience</label>
              <select id="audience" name="audience" disabled={Boolean(activeId)} value={formData.audience} onChange={handleChange} className="field-control">
                {AUDIENCES.map((audience) => <option key={audience} value={audience}>{audience}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="meetingLink">Meeting link</label>
              <input id="meetingLink" name="meetingLink" disabled={Boolean(activeId)} value={formData.meetingLink} onChange={handleChange} className="field-control" placeholder="https://meet.example.com" />
            </div>
          </div>

          {errorMessage ? <p className="alert-error" role="alert" aria-live="polite">{errorMessage}</p> : null}
          {successMessage ? <p className="alert-success" role="alert" aria-live="polite">{successMessage}</p> : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={Boolean(activeId)} className="btn-primary">
              {activeId === 'creating' || (editingId && activeId === editingId) ? 'Saving...' : (editingId ? 'Update Event' : 'Create Event')}
            </button>
            {editingId ? (
              <button type="button" disabled={Boolean(activeId)} onClick={resetForm} className="btn-secondary">
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mt-8 surface-card p-6 md:p-8">
        {isLoading ? (
          <LoadingState message="Loading events..." />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events created yet"
            description="Create an event to keep students and alumni informed about upcoming activity."
          />
        ) : (
          <div className="space-y-4">
            {events.map((eventItem) => (
              <article key={eventItem._id} className="content-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-section font-semibold text-text-primary">{eventItem.title}</h2>
                    <p className="mt-2 text-body text-text-secondary">{eventItem.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full border border-border bg-bg-secondary px-3 py-1 text-caption font-semibold uppercase tracking-wider text-text-primary">{eventItem.eventType}</span>
                    <span className="inline-flex rounded-full border border-border bg-bg-secondary px-3 py-1 text-caption font-semibold uppercase tracking-wider text-text-primary">{eventItem.mode}</span>
                    <span className="inline-flex rounded-full border border-border bg-bg-secondary px-3 py-1 text-caption font-semibold uppercase tracking-wider text-text-primary">{eventItem.audience}</span>
                    <StatusBadge value={eventItem.isActive ? 'ACTIVE' : 'INACTIVE'} />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-body text-text-secondary md:grid-cols-2">
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Date</span> <span className="font-medium text-text-primary">{new Date(eventItem.date).toLocaleDateString()}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Time</span> <span className="font-medium text-text-primary">{eventItem.startTime} - {eventItem.endTime}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Location</span> <span className="font-medium text-text-primary">{eventItem.location}</span></p>
                  <p><span className="text-badge font-bold uppercase tracking-wider text-text-muted block">Meeting link</span> <span className="font-medium text-text-primary">{eventItem.meetingLink || 'Not provided'}</span></p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="button" disabled={Boolean(activeId)} onClick={() => handleEdit(eventItem)} className="btn-secondary">
                    Edit
                  </button>
                  <button type="button" disabled={activeId === eventItem._id || Boolean(activeId)} onClick={() => handleToggle(eventItem._id)} className="btn-secondary">
                    {eventItem.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button type="button" disabled={activeId === eventItem._id || Boolean(activeId)} onClick={() => handleDelete(eventItem._id)} className="btn-danger">
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default EventsPage;
