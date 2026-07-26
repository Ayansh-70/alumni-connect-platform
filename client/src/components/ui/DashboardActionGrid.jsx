import { Link } from 'react-router-dom';
import { Users, Network, Briefcase, Calendar, Shield, User, Layout, ArrowRight } from 'lucide-react';

function DashboardActionGrid({ actions }) {
  const getCardStyle = (eyebrow, title, index) => {
    const key = (eyebrow || '').toLowerCase();
    
    let spanClass = 'col-span-1';
    let Icon = Layout;

    if (index === 0 || title.includes('Search') || title.includes('Verification')) {
      spanClass = 'md:col-span-2';
    }

    if (key.includes('people') || title.includes('Manage')) {
      Icon = Users;
    } else if (key.includes('network') || title.includes('Connections') || title.includes('Search')) {
      Icon = Network;
    } else if (key.includes('sharing') || title.includes('Opportunity') || title.includes('Opportunities')) {
      Icon = Briefcase;
    } else if (key.includes('broadcast') || key.includes('campus') || title.includes('Announcements') || title.includes('Events')) {
      Icon = Calendar;
    } else if (key.includes('approval') || title.includes('Requests')) {
      Icon = Shield;
    } else if (key.includes('overview') || title.includes('Profile')) {
      Icon = User;
    }

    return { spanClass, Icon };
  };

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {actions.map((action, index) => {
        const { spanClass, Icon } = getCardStyle(
          action.eyebrow,
          action.title,
          index
        );

        return (
          <Link
            key={action.to}
            to={action.to}
            className={`group content-card flex flex-col justify-between min-h-[16rem] ${spanClass}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-badge font-bold uppercase tracking-wider text-text-secondary">
                  {action.eyebrow || 'Workspace'}
                </span>
                
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-secondary text-text-secondary transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
              </div>

              <h2 className="mt-6 text-section font-bold tracking-tight text-text-primary transition-colors group-hover:text-primary">
                {action.title}
              </h2>
              
              <p className="mt-2 text-body text-text-secondary">
                {action.description}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
              <span className="inline-flex items-center text-button font-semibold text-text-primary transition-colors group-hover:text-primary">
                Launch
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
              </span>
            </div>
          </Link>
        );
      })}
    </section>
  );
}

export default DashboardActionGrid;
