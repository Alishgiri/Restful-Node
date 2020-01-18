const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB…", err));

/*
MONGOOSE SCHEMA TYPES
-------------
String, Number, Date, Buffer, Boolean, ObjectID, Array
*/

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  author: String,
  tags: [String],
  category: {
    type: String,
    enum: ["web", "mobile", "network"]
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    // price is required only if isPublished is true
    required: function() {
      return this.isPublished;
    }
  }
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Node.js Course",
    author: "Mosh",
    tags: ["node", "express"],
    isPublished: true
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
  }
}

async function getCourses() {
  // COMPARISION OPERATORS
  /*
    eq (equal)
    ne (not equal)
    gt (greater than)
    gte (greate than or equal to)
    lt (less than)
    lte (less than or equal to)
    in 
    nin (no in)
    */
  const coursesWithComparisionQuery = await Course.find({
    price: { $in: [10, 15, 20] } /*{ $gte: 10, $lte: 20 }*/
  }) // $ - dollar sign indicates that it is an operator.
    .limit(10)
    .sort({ name: 1 }) // 1 means ascending, -1 for decending order
    .select({ name: 1, tags: 1 }); // select the property that you wan to return from the document
  console.log(courses);

  // LOGICAL OPERATORS
  /** or and */
  const coursesWithLogicalQuery = await Course.find({ author: /.*Mosh.*/ })
    // .* means it can have 0 or more characters
    .find({ author: /^Mosh/ })
    // Regex: caret indicates start of string
    .find({ author: /Hamedani$/i })
    // Regex: dollor represents ends of string
    // i represents case-insensitive, remove i then case-sensitive
    .or([{ author: "Mosh" }, { isPublished: true }])
    .and([])
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
}

// PAGINATION IN MONGO
async function paginationExample() {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({ author: "mosh", isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .count();
}

// UPDATING DOCUMENT
async function updateCourse(id) {
  // APPROACH 1
  const course = await Course.findById(id);
  if (!course) return;

  course.isPublished = true;
  course.author = "Another Author";
  //OR
  //   course.set({
  //     isPublished: true,
  //     author: "Another Author"
  //   });

  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
  }

  // APPROACH 2
  // update directly in the database without retrieving
  const result = await Course.update(
    { _id: id },
    {
      // Search for 'MongoDB update Operators'
      // ($currentDate, $inc, $min, $max, $mul, $rename, $set, $setOnInset, $unset)
      $set: {
        author: "Alish",
        isPublished: false
      }
    }
  );
  // Update directly and retrieve updated item
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: { authoer: "Jack", isPublished: true }
    },
    { new: true }
  );
  console.log(course);
}

// Removing a document
async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id });
  const deleteMultipleResult = await Course.deleteMany({ isPublished: false });
}
