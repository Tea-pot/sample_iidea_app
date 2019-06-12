if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: "mongodb+srv://kamil_k:kamil_k@cluster0-yuyxz.mongodb.net/test?retryWrites=true&w=majority"}; 

}else {
  module.exports = {mongoURI: "mongodb://localhost/vidide-dev"};
};