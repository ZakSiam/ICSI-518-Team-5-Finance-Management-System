/* eslint-disable react/prop-types */
const Message = ({ notification }) => {
    return (
      <>
        <div id="notificationHeader">
          {/* optional image */}
          {notification.image && (
            <div id="imageContainer">
              <img src={notification.image} width={100} />
            </div>
          )}
          <span>{notification.title}</span>
        </div>
        <div id="notificationBody">{notification.body}</div>
      </>
    );
  };
  
  export default Message;
