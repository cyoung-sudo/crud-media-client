import "./PostsList.css";
import { useNavigate } from "react-router-dom";
// Types
import { Post } from "../../types/index.ds";
// Bootstrap
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

interface PostsListProps {
  posts: Post[];
  userId?: string;
  editPost?: (id: string) => void;
  deletePost?: (id: string) => void;
};

const PostsList: React.FC<PostsListProps> = ({ posts, userId=null, editPost=null, deletePost=null }) => {
  // Hooks
  const navigate = useNavigate();

  return (
    <ListGroup id="postsList">
      {posts.map((post: Post, idx: number) => (
        <ListGroup.Item className="postsList-post" key={idx}>
          <div className="postsList-post-title">{post.title}</div>
          <div className="postsList-post-text">{post.text}</div>
          <div className="postsList-post-username">
            By: <button onClick={() => navigate(`/users/${post.userId}`)}>{post.username}</button>
          </div>
          <div className="postsList-post-date">Posted: {new Date(post.createdAt).toDateString()}</div>
          {(post.userId === userId) && deletePost && editPost && 
            <div className="postsList-post-actions">
              <Button variant="warning" onClick={() => editPost(post._id)}>Edit</Button>
              <Button variant="danger" onClick={() => deletePost(post._id)}>Delete</Button>
            </div>
          }
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PostsList;