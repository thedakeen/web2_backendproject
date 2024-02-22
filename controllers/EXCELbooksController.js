//
// const {books,genres,authors} =require('../models/booksModel');
// const reader = require('xlsx')
// const bookModel =require('../models/booksModel');
//
// const file = reader.readFile(`data/books.xlsx`);
// const sheetNames = file.SheetNames;
//
// function validateBook(book) {
//     const { Name, Author, PublishYear, PagesCount, Price } = book;
//
//     if (typeof Name !== 'string' || Name.length < 2 || Name.length > 30 ||
//         typeof Author !== 'string' || Author.length < 2 || Author.length > 30) {
//         return false;
//     }
//
//     if (!Number.isInteger(PublishYear) || PublishYear < 1900 || PublishYear > 2024 ||
//         !Number.isInteger(PagesCount) || PagesCount < 3 || PagesCount > 1300 ||
//         typeof Price !== 'number' || Price < 0 || Price > 150000) {
//         return false;
//     }
//
//     return true;
// }
//
//
// const getAllBooks = (req, res) =>{
//
//     if(books.length === 0){
//         return res.status(404).json({
//             status: 'Not Found',
//             message: 'There is no books',
//         })
//     }
//
//     res.status(200).json({
//         status: 'success',
//         results: books.length,
//         data: {
//             books: books,
//         },
//     });
// }
//
// const getBooksByPages = (req, res) => {
//     const page = req.query.page || 1;
//     const pageSize = 10;
//
//     const startIndex = (page - 1) * pageSize;
//     const endIndex = page * pageSize;
//
//     const paginatedBooks = books.slice(startIndex, endIndex);
//
//     if (paginatedBooks.length === 0) {
//         return res.status(404).json({
//             status: 'Not Found',
//             message: 'No books found for the specified page.',
//         });
//     }
//
//     res.status(200).json({
//         status: 'success',
//         results: paginatedBooks.length,
//         data: {
//             books: paginatedBooks,
//         },
//     });
// };
//
//
// const getAllAuthors = (req,res) =>{
//     if(authors.length === 0){
//         return res.status(404).json({
//             status: 'Not Found',
//             message: 'There is no authors',
//         })
//     }
//
//     res.status(200).json({
//         status: 'success',
//         results: authors.length,
//         data: {
//             authors: authors,
//         },
//     });
// }
//
//
// const getAllGenres = (req, res) =>{
//     if(genres.length === 0){
//         return res.status(404).json({
//             status: 'Not Found',
//             message: 'There is no genres',
//         })
//     }
//
//     res.status(200).json({
//         status: 'success',
//         results: genres.length,
//         data: {
//             genres: genres,
//         },
//     });
// }
//
//
// /////////////////////////////////////////////////////////////////
//
// const addBook = (req,res) =>{
//     let fileName =  req.query.filename || 'default';
//     const newBook = req.body.book;
//
//     const isValid = validateBook(newBook);
//
//     if(!isValid){
//         res.status(400).json({
//             status: 'error',
//             message: 'Invalid book data',
//         });
//         return;
//     }
//
//     const sheetNames = file.SheetNames;
//
//     sheetNames.forEach((sheetName) => {
//         const arr = reader.utils.sheet_to_json(file.Sheets[sheetName]);
//
//
//         newBook.id = arr.length + 1;
//
//         arr.push(newBook)
//
//         const newWorkbook = reader.utils.book_new();
//         reader.utils.book_append_sheet(newWorkbook,reader.utils.json_to_sheet(arr),sheetName);
//         reader.writeFile(newWorkbook,'data/books.xlsx');
//     })
//
//     res.status(201).json({
//         status: 'success',
//         message: 'Book added successfully.',
//         data: {
//             book: newBook,
//         },
//     });
// }
//
// const updateBook = (req,res) => {
//     const fileName = req.query.filename || 'default';
//     const bookId = parseInt(req.params.id, 10);
//     const updatedBook = req.body.book;
//
//     const isValid = validateBook(updatedBook);
//
//     if (!isValid) {
//         res.status(400).json({
//             status: 'error',
//             message: 'Invalid book data',
//         });
//         return;
//     }
//
//     const sheetNames = file.SheetNames;
//
//     let isBookUpdated = false;
//
//     sheetNames.forEach((sheetName) => {
//         const arr = reader.utils.sheet_to_json(file.Sheets[sheetName]);
//
//         const index = arr.findIndex(book => book.id === bookId);
//
//         if (index !== -1) {
//             arr[index] = { ...arr[index], ...updatedBook };
//             isBookUpdated = true;
//
//             const newWorkbook = reader.utils.book_new();
//             reader.utils.book_append_sheet(newWorkbook, reader.utils.json_to_sheet(arr), sheetName);
//             reader.writeFile(newWorkbook, 'data/books.xlsx');
//         }
//     });
//
//     if (!isBookUpdated) {
//         res.status(404).json({
//             status: 'error',
//             message: 'Book not found.',
//         });
//     }
//
//     res.status(200).json({
//         status: 'success',
//         message: 'Book updated successfully.',
//         data: {
//             book: updatedBook,
//         },
//     });
//
// }
//
// const deleteBook = (req,res) =>{
//     const bookId = parseInt(req.params.id, 10);
//
//     const sheetNames = file.SheetNames;
//     let isBookDeleted = false;
//
//     sheetNames.forEach((sheetName) => {
//         const arr = reader.utils.sheet_to_json(file.Sheets[sheetName]);
//
//         const index = arr.findIndex((book) => book.id === bookId);
//
//         if (index !== -1) {
//             arr.splice(index, 1);
//             isBookDeleted = true;
//
//             const newWorkbook = reader.utils.book_new();
//             reader.utils.book_append_sheet(newWorkbook, reader.utils.json_to_sheet(arr), sheetName);
//             reader.writeFile(newWorkbook, 'data/books.xlsx');
//         }
//     });
//
//     if(!isBookDeleted){
//         return res.status(404).json({
//             status: 'error',
//             message: 'Book not found'
//         })
//     }
//
//
//     res.status(200).json({
//         status: 'success',
//         message: 'Book updated successfully.',
//         data: {
//             book: bookId,
//         },
//     });
//
// }
//
//
//
// //////////////// sort
//
// const getBookByName = (req, res) => {
//
//     const book = books.find((el) => el.Name === req.params.name);
//
//     if (!book) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'No books found with the specified name.',
//         });
//     }
//
//     res.status(200).json({
//         status: 'success',
//         data: {
//             book,
//         },
//     });
// }
// const getBookByPrice = (req, res) => {
//     const data = []
//
//     books.forEach((book) => {
//         if(book.Price === Number(req.params.price)){
//             data.push(book)
//         }
//     })
//
//     if (data.length == 0) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'No books found with the specified price',
//         });
//     }
//
//     res.status(200).json({
//         status: 'success',
//         data: {
//             data,
//         },
//     });
// }
//
//
// module.exports = {
//     getAllBooks,
//     getAllAuthors,
//     getAllGenres,
//     addBook,
//     updateBook,
//     deleteBook,
//     getBookByPrice,
//     getBookByName,
//     getBooksByPages,
// }