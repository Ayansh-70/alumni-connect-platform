const mongoose = require('mongoose');
const uri = "mongodb+srv://ayanshsharma140011_db_user:5j8EsYRDnrb0UnGK@alumniconnectcluster.7xyvtpm.mongodb.net/alumniconnect?retryWrites=true&w=majority&appName=AlumniConnectCluster";

mongoose.connect(uri)
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Error:', err.message));
