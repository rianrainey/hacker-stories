const welcome = {
  title: 'Hey',
  greeting: 'React'
};

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]

function getTitle(title: string){
  return title;
}

function App() {
  return (
    <div>
      <h1>{welcome.title} {getTitle(welcome.greeting)}</h1>

      <label htmlFor="search">Search: </label> {/* htmlFor allows clicking on label to put focus in input#search */}
      <input id="search" type="text" />
      <hr />
      <h1>Articles</h1>
      <ul>
        {list.map((item, index) => {
          return (
            <li key={index}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export default App