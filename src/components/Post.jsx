import React from 'react'

const Post = (props) => {
  return (<div className="video-container">
    <Video src={props.post.mediaLink}></Video>
  </div>);
}

function Video(props) {
  return (
    <video
      className="video-styles"
      muted={true}
      loop={true}
      controls
      style={{height: "80vh", margin: "5rem", border: "1px solid whitesmoke"}}
    >
      <source src={props.src} type="video/mp4" />
    </video>
  )
}

export default Post;