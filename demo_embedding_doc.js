const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Successfully connected to database."))
  .catch(() => console.log("Could not connect to MongoDB"));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    author: authorSchema
  })
);

async function createCourse(name, author) {
  const course = new Course({ name, author });
  await course.save();
  console.log(course);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateCourse(courseId) {
  const course = await Course.findById(courseId);
  course.author.name = "Mosh Hamedani";
  course.save();
}

createCourse("Node Course", new Author({ name: "Mosh" }));
