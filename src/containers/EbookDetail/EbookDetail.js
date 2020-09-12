import React, { Component } from "react";
import { connect } from "react-redux";
import "./EbookDetail.css";
import * as actions from "../../store/action/rootActions";
import SearchEbookByInputName from "../../components/SearchEbookByInputName/SearchEbookByInputName";
import SuggestionBook from "../../components/SuggestionBook/SuggestionBook";
import AuthInput from "../../components/UI/AuthInput/AuthInput";
import cover from "../../assets/ss.jpg";
import Spinner from "../../components/UI/Spinner/Spinner";

class EbookDetail extends Component {
   state = {
      params: null,
      commentForm: {
         email: {
            elementType: "input",
            elementConfig: {
               type: "email",
            },
            validation: {
               isRequired: true,
               isEmail: true,
            },
            label: "Email",
            value: "",
            isValid: false,
            errMsg: "Email isn't valid.",
         },
         comment: {
            elementType: "textarea",
            validation: {
               isRequired: true,
            },
            label: "Comment",
            value: "",
            isValid: false,
            errMsg: "Comment is required.",
         },
      },
   };

   componentDidMount() {
      const book_id = this.props.match.params.book_id;
      this.setState({ params: this.props.history.location.pathname });
      this.props.onFetchDetailOfEbook(book_id);
   }

   componentDidUpdate() {
      const newParms = this.props.history.location.pathname;
      if (this.state.params !== newParms) {
         const book_id = this.props.match.params.book_id;
         this.setState({ params: newParms });
         this.props.onFetchDetailOfEbook(book_id);
         return true;
      } else {
         return false;
      }
   }

   checkValidation = (value, rules) => {
      let valid = false;
      if (rules.isRequired) {
         valid = value.trim() !== "";
      }

      if (rules.isEmail) {
         const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
         valid = pattern.test(value);
      }
      return valid;
   };

   inputChangeHandler = (event, key) => {
      const value = event.target.value;
      const updateCommentForm = { ...this.state.commentForm };
      updateCommentForm[key].value = value;
      updateCommentForm[key].isTouch = true;
      updateCommentForm[key].isValid = this.checkValidation(
         value,
         updateCommentForm[key].validation
      );
      this.setState({ commentForm: updateCommentForm });
   };

   canClickBtn = () => {
      let canClick = false;
      for (let key in this.state.commentForm) {
         canClick = this.state.commentForm[key].isValid;
      }
      return canClick;
   };

   render() {
      let ebookDetail = null;
      // Whether Show Spinner or Result page by checking loading
      if (this.props.loading) {
         ebookDetail = <Spinner />;
      } else {
         // if not loading
         // then check detail of ebook
         if (this.props.detail_of_ebook) {
            const bookInfo = (
               <div className="row BookInfo">
                  <div className="col col-md-4 BookInfo__BookCover">
                     <img src={cover} alt="Book Cover" />
                  </div>
                  <div className="col col-md-8 BookInfo__Info">
                     <h1>{this.props.detail_of_ebook.bookName}</h1>
                     <p className="BookInfo__Info__ReleasedYear">
                        Release Year: {this.props.detail_of_ebook.releasedYear}
                     </p>
                     <p>Author: {this.props.detail_of_ebook.author}</p>
                     <p>File Size: {this.props.detail_of_ebook.fileSide} MB</p>
                     <p>
                        Page Number: {this.props.detail_of_ebook.pages} Pages
                     </p>
                     <p>{this.props.detail_of_ebook.description}</p>
                     <a
                        href={this.props.detail_of_ebook.pdfLocation}
                        className="BookInfo__Info__DownloadBtn"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <button>Download</button>
                     </a>
                  </div>
               </div>
            );

            const suggestions = this.props.suggestionBooks.map(
               (suggestionBook) => {
                  return (
                     <SuggestionBook
                        key={suggestionBook._id}
                        {...suggestionBook}
                     />
                  );
               }
            );

            let commentInputs = [];
            for (let key in this.state.commentForm) {
               commentInputs.push(
                  <AuthInput
                     key={key}
                     elementtype={this.state.commentForm[key].elementType}
                     elementconfig={this.state.commentForm[key].elementConfig}
                     label={this.state.commentForm[key].label}
                     value={this.state.commentForm[key].value}
                     touched={this.state.commentForm[key].isTouch}
                     invalid={!this.state.commentForm[key].isValid}
                     errMsg={this.state.commentForm[key].errMsg}
                     changed={(e) => this.inputChangeHandler(e, key)}
                  />
               );
            }

            const commentBox = (
               <form>
                  {commentInputs}
                  <div className="form-group">
                     <button disabled={!this.canClickBtn()}>Comment</button>
                  </div>
               </form>
            );

            ebookDetail = (
               <div className="EbookDetail">
                  <div className="SearchEbookByInputNameBox">
                     <SearchEbookByInputName history={this.props.history} />
                  </div>
                  <hr className="Tag__hr" />
                  {bookInfo}
                  <div className="EbookDetail__Suggestions">
                     <h1>Suggestions</h1>
                     <div className="EbookDetail__Suggestions__Books">
                        {suggestions}
                     </div>
                  </div>
                  <div className="EbookDetail__Comment">
                     <div className="EbookDetail__Comment__Title">
                        <h1>Comments:</h1>
                     </div>
                     <div className="EbookDetail__Comment__CommentBox">
                        {commentBox}
                     </div>
                  </div>
               </div>
            );
         }
      }
      return ebookDetail;
   }
}

const stateToProps = (state) => {
   return {
      detail_of_ebook: state.ebook.detail_of_ebook,
      suggestionBooks: state.ebook.suggestionBooks,
      loading: state.ebook.loading,
   };
};

const dispatchToProps = (dispatch) => {
   return {
      onFetchDetailOfEbook: (book_id) =>
         dispatch(actions.onFetchDetailOfEbook(book_id)),
   };
};

export default connect(stateToProps, dispatchToProps)(EbookDetail);
