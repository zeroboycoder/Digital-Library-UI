// Go to Book Detail
export const clickedLink = (book_id, props) => {
   props.history.push(`/ebooks/${book_id}`);
};

// Search ebook with tag
export const clickTag = (name, categoryName, props) => {
   props.history.push(`/categories/${categoryName}/${name}`);
};
