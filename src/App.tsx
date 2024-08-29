import * as React from 'react';

type Story = {
  objectID: number,
  url: string,
  title: string,
  author: string,
  num_comments: number,
  points: number
}

const App = () => {
  console.log('App renders');

  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem('search') || 'React'
  );

  /*
    Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a function component (referred to as React’s render phase).
    Doing so will lead to confusing bugs and inconsistencies in the UI.
    Instead, use useEffect. The function passed to useEffect will run after the render is committed to the screen.
    Think of effects as an escape hatch from React’s purely functional world into the imperative world.

    [searchTerm]: This is the dependency array.
    The effect will run whenever the values in this array change.
    In this case, it means that the effect will execute every time searchTerm is updated.
    If searchTerm remains the same, the effect will not run again.
  */
  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm])

  const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }
  const stories = [
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
  ];
  const searchedStories = stories.filter(function(story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search onSearch={handleSearch} searchTerm={searchTerm}/>
      <hr />
      <List list={searchedStories}/>
    </div>
  );
}

type searchProps = {
  onSearch: (element: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string
}
const Search = ({searchTerm, onSearch}:searchProps) => {
  console.log('Search renders');

  return (
    <div>
      <label htmlFor="search" >Search: </label> {/* htmlFor allows clicking on label to put focus in input#search */}
      <input id="search" type="text" value={searchTerm} onChange={onSearch} />
    </div>
  )
}

type ListProps = {
  list: Story[];
}

const List = ({list}:ListProps) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
);

type ItemProps = {
  item: Story
}

const Item = ({item}:ItemProps) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
);

export default App