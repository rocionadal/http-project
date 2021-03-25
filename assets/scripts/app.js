const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

function sendHttpRequest(method, url, data) {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        response.json()
        throw new Error('Something went wrong!'); // handle server error
      }
    })
    .catch(error => { // handle network error
      console.log(error);
      throw new Error('Something went wrong!');
    });

  // ------ OLD JS XML ------
  // const promise = new Promise((resolve, reject) => {
  //   const xhr = new XMLHttpRequest();
  // //   xhr.setRequestHaeder('Content-Type', 'application/json');
  //   xhr.open(method, url);
  //   xhr.responseType = 'json';
    
  //   xhr.onload = function() {
  //     if (hxr.status >= 200 && xhr.status < 300) {
  //       resolve(xhr.response);
  //       // const listOfPosts = JSON.parse(xhr.response);
  //     } else {
  //       xhr.response;
  //       reject(new Error('Something went wrong!')); // handle server side error
  //     }
  //   };

  //   xhr.onerror = function() { // handle network error
  //     reject(new Error('Failed to send request!'));
  //   }
    
  //   xhr.send(JSON.stringify(data));
  // });

  // return promise;
}

async function fetchPosts() {
  try {
    const responseData = await sendHttpRequest(
      'GET', 
      'https://jsonplaceholder.typicode.com/posts'
    );
    const listOfPosts = responseData;
    for (const post of listOfPosts) {
      const postEl = document.importNode(postTemplate.content, true);
      postEl.querySelector('h2').textContent = post.title.toUpperCase();
      postEl.querySelector('p').textContent = post.body;
      postEl.querySelector('li').id = post.id;
      listElement.append(postEl);
    }
  } catch (error) {
    alert(error.message);
  }
}

async function createPost(title, content) {
  const userId = Math.random();
  const post = {
    title: title,
    body: content,
    userId: userId
  };

  sendHttpRequest(
    'POST', 
    'https://jsonplaceholder.typicode.com/posts', 
    post
  );
}

fetchButton.addEventListener('click', fetchPosts);
form.addEventListener('submit', event => {
  event.preventDefault();
  const enteredTitle = event.currentTarget.querySelector('#title').value;
  const enteredContent = event.currentTarget.querySelector('#content').value;
  createPost(enteredTitle, enteredContent);
  console.log(`Post with title ${enteredTitle} was submitted`);
})

postList.addEventListener('click', event => {
  if (event.target.tagName === 'BUTTON') {
    const postId = event.target.closest('li').id;
    sendHttpRequest(
      'DELETE', 
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    console.log(`Post with id of ${postId} was deleted`);
  }
})