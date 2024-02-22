// const reader = require("xlsx");
// const books = []
// const authors = []
// const genres = []
//
//
//
// try{
//     const file = reader.readFile(`data/books.xlsx`);
//     const sheetNames = file.SheetNames
//
//     for (let i = 0; i < sheetNames.length; i++) {
//         const arr = reader.utils.sheet_to_json(file.Sheets[sheetNames[i]])
//         arr.forEach((book) => {
//             books.push(book);
//             authors.push(`${book.Author} (${book.Name})`)
//             genres.push(`${book.Name} || Genres: ${book.Genres}`);
//         })
//     }
// }catch (err){
//     console.log(err);
// }
//
// module.exports = {
//     books,
//     authors,
//     genres,
// };