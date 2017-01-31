import React, { Component } from 'react';
import Comment from '../presentations/Comment';
import CommentHeader from '../presentations/CommentHeader';
import CommentCreate from '../presentations/CommentCreate';
import { APIManager } from '../../utils';

class Comments extends Component {
    
    constructor() {
        super()
        
        this.state = {
            commentList: []
        }
    }
    
    componentDidMount() {
        
        APIManager.get('api/comment', null, (err, response) => {
            if (err) {
                console.log('ERROR COMMENTS FIND: ' + err.message);
                return
            }
                
            this.setState({
                commentList: response.results
            });
        })
    }
    
    // adds the current `comment` object to the `commentList` array
    submitHandler(comment) {
        // save comment to mongo
        APIManager.post('/api/comment', comment, (err, response) => {
            if (err) {
                console.log("ERROR: " + err.message, null);
                return
            }
            
            const result = response.result;
            
            console.log("SUCCESS: COMMENT CREATED " +
                        JSON.stringify(result));
                        
            // set the state
            // result has been processed by the API, so the default
            // timestamp has been added to the object
            let updatedCommentList = Object.assign([], this.state.commentList);
            updatedCommentList.unshift(result);
            this.setState({
                //commentList: this.state.commentList.concat(result)
                commentList: updatedCommentList
            });
        });
    }
    
    deleteHandler(event) {
        event.preventDefault();
        
        // need to generalize to use comment _id
        //const index = indexOf()
        //if (index > -1) {
        //    this.setState({
        //        commentList: commentList.splice(index, 1)
        //    });    
        //}
        
        
        superagent
            .delete('/api/comment/588e72d29d964c3b6366da79')
            .end((err, res) => {
                if (err) {
                   alert('ERROR: COMMENT DELETE ' + err);
                   return
               } 
               console.log('SUCCESS: COMMENT DELETE');
            })
       
    }
    
    render() {
        
        const commentList = this.state.commentList.map((x) => {
            return (
                <li key={ x._id } style={{listStyle: 'none'}}>
                    <Comment commentPropsObj={ x } 
                             deleteHandler={this.deleteHandler.bind(this)} />
                </li>
            );
        })
        
        return (
            <div>
                <CommentHeader zoneName={this.props.currentZone} />
                
                <div style={{padding:12, 
                             background:'#f9f9f9', 
                             border:'1px solid #ddd'}}
                     className="clearfix">
                    <CommentCreate onCreate={this.submitHandler.bind(this)}/>
                    <br />
                    <ul>
                        { commentList }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Comments;