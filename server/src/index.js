import express from "express";
import pg from "pg";
import config from "./config.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: true,
});

const app = express();
app.use(express.json());
const port = 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// ---------------------------------
// Helper Functions
// ---------------------------------

// 1. getAllAnimals()
async function getAllAnimals() {
  const result = await db.query("SELECT * FROM animals");
  return result.rows;
}

// 2. getOneAnimalByName(name)
async function getOneAnimalByName(name) {
  const result = await db.query("SELECT * FROM animals WHERE name = $1", [
    name,
  ]);
  return result.rows[0];
}

// 3. getOneAnimalById(id)
async function getOneAnimalById(id) {
  const result = await db.query("SELECT * FROM animals WHERE id = $1", [id]);
  return result.rows[0];
}

// 4. getNewestAnimal()
async function getNewestAnimal() {
  const result = await db.query(
    "SELECT * FROM animals ORDER BY created_at DESC LIMIT 1",
  );
  return result.rows[0];
}

// 5. 🌟 BONUS CHALLENGE — getAllMammals()
async function getAllMammals() {
  const result = await db.query("SELECT * FROM animals WHERE category = $1", [
    "mammal",
  ]);
  return result.rows;
}

// 6. 🌟 BONUS CHALLENGE — getAnimalsByCategory(category)
async function getAnimalsByCategory(category) {
  const result = await db.query("SELECT * FROM animals WHERE category = $1", [
    category,
  ]);
  return result.rows;
}

// 7. deleteOneAnimal(id)
async function deleteOneAnimal(id) {
  await db.query("DELETE FROM animals WHERE id = $1", [id]);
}

// 8. addOneAnimal(name, category, can_fly, lives_in)
async function addOneAnimal(name, category, can_fly, lives_in) {
  await db.query(
    "INSERT INTO animals (name, category, can_fly, lives_in) VALUES ($1, $2, $3, $4)",
    [name, category, can_fly, lives_in],
  );
}

// -------- example for assessment---------------
// 9. updateOneAnimalName(id, newName)
async function updateOneAnimalName(id, newName) {
  await db.query("UPDATE animals SET name = $1 WHERE id = $2", [newName, id]);
}

// 10. updateOneAnimalCategory(id, newCategory)
async function updateOneAnimalCategory(id, newCategory) {
  await db.query("UPDATE animals SET category = $1 WHERE id = $2", [
    newCategory,
    id,
  ]);
}

// 11. 🌟 BONUS CHALLENGE — addManyAnimals(animals)
async function addManyAnimals(animals) {
  const promises = animals.map((animal) =>
    addOneAnimal(animal.name, animal.category, animal.can_fly, animal.lives_in),
  );
  await Promise.all(promises);
}

// ---------------------------------
// API Endpoints
// ---------------------------------

// 1. GET /get-all-animals
app.get("/get-all-animals", async (req, res) => {
  const animals = await getAllAnimals();
  res.json(animals);
});

// 2. GET /get-one-animal-by-name/:name
app.get("/get-one-animal-by-name/:name", async (req, res) => {
  const { name } = req.params;
  const animal = await getOneAnimalByName(name);
  res.json(animal);
});

// 3. GET /get-one-animal-by-id/:id
app.get("/get-one-animal-by-id/:id", async (req, res) => {
  const { id } = req.params;
  const animal = await getOneAnimalById(id);
  res.json(animal);
});

// 4. GET /get-newest-animal
app.get("/get-newest-animal", async (req, res) => {
  const animal = await getNewestAnimal();
  res.json(animal);
});

// 5. 🌟 BONUS CHALLENGE — GET /get-all-mammals
app.get("/get-all-mammals", async (req, res) => {
  const mammals = await getAllMammals();
  res.json(mammals);
});

// 6. 🌟 BONUS CHALLENGE — GET /get-animals-by-category/:category
app.get("/get-animals-by-category/:category", async (req, res) => {
  const { category } = req.params;
  const animals = await getAnimalsByCategory(category);
  res.json(animals);
});

// 7. POST /delete-one-animal/:id
app.post("/delete-one-animal/:id", async (req, res) => {
  const { id } = req.params;
  await deleteOneAnimal(id);
  res.send(`Success! Animal ${id} was deleted!`);
});

// 8. POST /add-one-animal
app.post("/add-one-animal", async (req, res) => {
  const { name, category, can_fly, lives_in } = req.body;
  await addOneAnimal(name, category, can_fly, lives_in);
  res.send(`Success! ${name} was added!`);
});


// -------- example for assessment---------------
// 9. POST /update-one-animal-name
app.post("/update-one-animal-name", async (req, res) => {
  const { id, newName } = req.body;
  await updateOneAnimalName(id, newName);
  res.send(`Success! Animal ${id}'s name was updated to ${newName}!`);
});

// 10. POST /update-one-animal-category
app.post("/update-one-animal-category", async (req, res) => {
  const { id, newCategory } = req.body;
  await updateOneAnimalCategory(id, newCategory);
  res.send(`Success! Animal ${id}'s category was updated to ${newCategory}!`);
});

// 11. 🌟 BONUS CHALLENGE — POST /add-many-animals
app.post("/add-many-animals", async (req, res) => {
  const { animals } = req.body;
  await addManyAnimals(animals);
  res.send(`Success! ${animals.length} animals were added!`);
});
