// const mongoose = require('mongoose');
// const fs = require('fs');
// const path = require('path');

// const imageSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   price:{
//     type: String,
//     required: true
//   },
//   img: {
//     data: Buffer,
//     contentType: String
//   }
// });

// const Image = mongoose.model('Image', imageSchema);


// const fs = require('fs');

// const newImage = new Image({
//   name: '8000 Seriesnode',
//   description:'This is 80 series',
//   price: '$32,9090',
//   img: {
//     data: fs.readFileSync(path.join(__dirname, 'Images/80 Series.png')),
//     contentType: 'image/jpg'
//   }
// });

// newImage.save()
//   .then(() => console.log('Image saved'))
//   .catch(err => console.log(err));



const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nooobsCars', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('Connection error:', err);
});

const imageSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price:{
    type: String,
    required: true
  },
  img: {
    data: Buffer,
    contentType: String
  }
});

const Image = mongoose.model('Image', imageSchema);

// Function to save image to the database
const saveImage = async () => {
  const newImage = new Image({
    Name: 'example',
    description: 'This is 80 series',
    price: '$32,9090',
    img: {
      data: fs.readFileSync(path.join(__dirname, 'Images/80 Series.png')),
      contentType: 'image/jpg'
    }
  });

  try {
    await newImage.save();
    console.log('Image saved');
  } catch (err) {
    console.log('Error saving image:', err);
  }
};

// Export the saveImage function
module.exports = saveImage;
