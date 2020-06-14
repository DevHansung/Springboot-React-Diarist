import React, { Component } from 'react';
import {loadBoardByBoid, loadReplyByBoid, uploadReply, uploadEditReply, deleteReply,
        uploadLike, deleteLike, loadLike, loadCountLikes,
        loadScrapByBoid, uploadScrap, deleteScrapByBsid}
        from '../../controller/APIController';
import { Form, Button, Input, Comment, List, Rate} from 'antd';
import {notificationError, notificationSuccess} from '../../util/Notification';
import "./DetailBoard.css";
const { TextArea } = Input;

class BoardDetail extends Component{
    constructor(props){
        super(props)

        this.state = {
            boid :'',
            title : '',
            text : '',
            writer : '',
            date : '',

            username : this.props.username,
            reid:null,
            reply : '',
            replys :[],
            like : null,
            fetchLikeid:null,
            countLikes:null,
            showInput:false,
            bsid : null
        }
        this.onUploadReply = this.onUploadReply.bind(this);
        this.onEditReply = this.onEditReply.bind(this);
        this.onUploadLike = this.onUploadLike.bind(this);
        this.onDeleteLike = this.onDeleteLike.bind(this);
        this.onUploadScrap = this.onUploadScrap.bind(this);
        this.onDeleteScrap = this.onDeleteScrap.bind(this);
    }

    componentDidMount(){
        this.loadBoard();
        this.loadReply();
        this.loadLike()
        this.loadCountLikes();
        this.loadScrap();
    }
    loadBoard() {
        loadBoardByBoid(parseInt(this.props.match.params.boid, 10), this.state.username)
            .then((res) => {
                this.setState({
                    boid : res.boid,
                    title : res.title,
                    text : res.text,
                    writer : res.writer,
                    date : res.date
                    })
            });
    }

    loadScrap(){
        loadScrapByBoid(parseInt(this.props.match.params.boid, 10), this.props.username)
            .then(res => {
                this.setState({
                    bsid : res
                });
            })
            .catch(error => {
            });
    }
    
    onUploadScrap(){
        try{
            uploadScrap(parseInt(this.props.match.params.boid, 10), this.props.username)
                .then(res => {
                    this.setState({
                        bsid : res
                    });
                    notificationSuccess("정상적으로 구독 되었습니다.")                                          

                }).catch(error => {
                    notificationError("작업중 문제가 발생하였습니다..")                                                                                
            });
        } catch(error) {
            notificationError("다시 시도해주세요..")                                          
        }
    }

    onDeleteScrap(){
        try{
            deleteScrapByBsid(this.state.bsid)
            .then(res => {
                notificationSuccess("구독을 취소 하였습니다.")  

                this.setState({
                    scrap : null,
                    bsid : null
                });
            }).catch(error => {
                notificationError("작업중 문제가 발생 하였습니다..")                                          
        });

        } catch(error){
            notificationError("다시 시도해주세요..")                                          
        }
    }

    loadReply(){
        loadReplyByBoid(parseInt(this.props.match.params.boid, 10))
            .then((res) => {
                this.setState({
                    replys : res
                    })
        });
    }
    onUploadReply(){
        uploadReply(parseInt(this.props.match.params.boid, 10),this.props.username, this.state.reply)
        .then(res =>{
            const { replys } = this.state;
            this.setState({
                reply: '',
                replys: replys.concat(res)
              });
              notificationSuccess("댓글을 작성 하였습니다.")  
        }).catch(error => {
            notificationError("작업중 문제가 발생 하였습니다.")              
    });
    }

    onEditReply(reid){
        uploadEditReply(reid, this.state.reply)
            .then(res=>{
                const { replys } = this.state;
                const index = replys.findIndex(reply => reply.reid === reid);
                const nextReplys = [...replys];
                nextReplys[index] = res
                this.setState({
                  showInput:false, 
                  input: '',
                  replys: nextReplys
                });
                notificationSuccess("댓글 수정을 완료 하였습니다.")  
            }).catch(error => {
                notificationError("작업중 문제가 발생 하였습니다.")                                          
        });
    }

    deleteReply = (reid) =>{
        deleteReply(reid)
            .then(res => {
                this.setState({replys:this.state.replys.filter(reply => reply.reid !== reid)})
            })
    }

    onReplyChange=(e)=>{
        this.setState({reply:e.target.value});
    }

    editReply(reid){
        this.setState({
            showInput:true,
            reid:reid
        })
    }

    loadCountLikes(){
        loadCountLikes(parseInt(this.props.match.params.boid, 10))
            .then(res => {
                this.setState({
                    countLikes : res
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    loadLike(){
        loadLike(parseInt(this.props.match.params.boid, 10), this.props.username)
            .then(res => {
                this.setState({
                    fetchLikeid : res
                });
            })
            
            .catch(error => {
                console.log(error)
            });
    }

    onUploadLike(){
        try{
            uploadLike(parseInt(this.props.match.params.boid, 10), this.props.username)
                .then(res =>{
                    this.setState({
                        fetchLikeid : res,
                        countLikes : this.state.countLikes+1
                    });
                    notificationSuccess("게시글을 추천 하였습니다.")                                          
                }).catch(error => {
                    notificationError("작업중 문제가 발생하였습니다..")                                                                                    
            });

        } catch(error) {
            notificationError("다시 시도해주세요..")                                          
        }
        
    }

    onDeleteLike(){
        try{
            deleteLike(parseInt(this.state.fetchLikeid, 10), this.props.username)
                .then(res => {
                    this.setState({
                        fetchLikeid : null,
                        countLikes : this.state.countLikes-1
                    });
                    notificationSuccess("게시글 추천을 취소 하였습니다.")                                          

                }).catch(error => {
                    notificationError("작업중 문제가 발생 하였습니다..")                                          
                });
        } catch(error) {
            notificationError("다시 시도해주세요..")                                          
        }
        
    }
    
    render(){
        var num = Number(this.state.countLikes);
        return (
            <div>
                <div className="wrap_viewer">
                    {this.state.boid ? (
                        <div>
                            <div className="top_viewer">
                                {this.state.title}
                            </div>
                            <div className="bottom_line">
                                내용<br></br><br></br>
                                {this.state.text}
                            </div>
                            <div className="bottom_line">
                               작성자 : { this.state.writer}<br></br>
                               작성일 : {this.state.date}
                            </div>                              
                        </div>
                    ) : (
                        <span>LOADING...</span>
                    )}
                </div>
                
                <div className="comment_container">
                    <div>
                        <span className="avgRate"> 추천수 : {num.toFixed(1)} </span>
                        <Rate disabled allowHalf style={{fontSize:36}} value={this.state.countLikes} className="avgStar"/>
                    </div>
                    <div className="rating_container">
                        {this.state.fetchLikeid===null ? <Button type="primary" size="small" onClick={this.onUploadLike}>추천</Button> :
                        <Button type="primary" size="small" onClick={this.onDeleteLike}>추천 취소</Button>}
                        {this.state.bsid === null || this.state.bsid.length === 0 ? 
                        <Button type="primary" size="small" onClick={this.onUploadScrap}>스크랩</Button> :
                        <Button type="primary" size="small" onClick={this.onDeleteScrap}>스크랩 취소</Button> 
                        }
                    </div>

                    <Form>
                        <Form.Item>
                            <TextArea rows={4} onChange={this.onReplyChange} value={this.state.reply} />
                        </Form.Item>
                        <Form.Item>
                        <Button type="primary" className="commentButton" onClick={this.onUploadReply}>
                            등록
                        </Button>
                        </Form.Item>
                    </Form>

                    <div>
                    <List
                        pagination={{pageSize: 10}}
                        className="comment-list"
                        header={`${this.state.replys.length} replies`}
                        itemLayout="horizontal"
                        dataSource={this.state.replys}
                        renderItem={item => (
                        <li>
                            <Comment
                            author={item.user}
                            content={item.reply}
                            datetime={item.updatedAt}
                            />
                            {item.user===this.state.username ? 
                            <div>
                                <Button onClick={()=>this.editReply(item.reid)}>수정</Button>
                                {this.state.showInput && item.reid === this.state.reid?
                                <div className="editForm-container">
                                    <Form>
                                        <Form.Item>
                                            <TextArea rows={4} onChange={this.onReplyChange} defaultValue={item.reply} /> 
                                        </Form.Item>
                                        
                                        <Form.Item>
                                            <Button type="primary" className="commentButton" onClick={()=>this.onEditReply(item.reid)}>
                                            수정
                                        </Button>
                                        </Form.Item>
                                    </Form>
                                </div> : null}
                                <Button onClick={()=>this.deleteReply(item.reid)}>삭제</Button>
                            </div> : null}
                        </li>
                        )}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default BoardDetail;