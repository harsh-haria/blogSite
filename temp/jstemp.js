const getButton = document.getElementById("get");
const postButton = document.getElementById("post");

getButton.addEventListener("click", () => {
  fetch("http://localhost:8080/feed/posts")
    .then((res) => res.json())
    .then((resData) => console.log(resData))
    .catch((err) => console.log(err));
});

postButton.addEventListener("click", () => {
  fetch("http://localhost:8080/feed/post", {
    method: "POST",
    body: JSON.stringify({
      title: "A Codepen Post",
      content: "Post created via codepen"
    }),
    headers: {
      "Content-Type": 'application/json'
    }
  })
    .then((res) => res.json())
    .then((resData) => console.log(resData))
    .catch((err) => console.log(err));
});

