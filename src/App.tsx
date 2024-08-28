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
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search />
      <hr />
      <List list={stories}/>
    </div>
  );
}

const Search = () => {
  console.log('Search renders');
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    console.log(event.target.value);
    setSearchTerm(event.target.value);
  }
  return (
    <div>
      <label htmlFor="search" >Search: </label> {/* htmlFor allows clicking on label to put focus in input#search */}
      <input id="search" type="text" onChange={handleChange} />
      <p>
        Searching for {searchTerm}
      </p>
    </div>
  )
}

type ListProps = {
  list: Story[];
}

const List = (props:ListProps) => {
  console.log('List renders');

  return (
    <ul>
      {props.list.map((item) => {
        {/* I guess key has to go here and not in Item component?  */ }
        return (
          <Item key={item.objectID} item={item}/>
        );
      })}
    </ul>
  )
}

type ItemProps = {
  item: Story
}

const Item = (props:ItemProps) => {
  console.log('Item renders');

  return (
    <li>
      <span>
        <a href={props.item.url}>{props.item.title}</a>
      </span>
      <span>{props.item.author}</span>
      <span>{props.item.num_comments}</span>
      <span>{props.item.points}</span>
    </li>
  )
}

export default App