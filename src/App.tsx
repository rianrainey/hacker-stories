import * as React from 'react';

type Story = {
  objectID: number,
  url: string,
  title: string,
  author: string,
  num_comments: number,
  points: number
}

const ACTIONS = {
  SET_STORIES: 'SET_STORIES',
  REMOVE_STORY: 'REMOVE_STORY'
}

/**
 * useStorageState is a custom React hook that manages a state value
 * that is synchronized with local storage. It takes a key and an
 * initial state as arguments. The hook initializes the state with
 * the value from local storage if it exists, or with the provided
 * initial state. It also provides a setter function to update the
 * state, which in turn updates the local storage whenever the
 * state changes.
 *
 * @param {string} key - The key used to store the value in local storage.
 * @param {string} initialState - The initial state value if no value
 *                                exists in local storage.
 * @returns {[string, function]} - An array containing the current
 *                                  state value and a function to
 *                                  update it.
 */

const useStorageState = (key:string, initialState:string) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
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
    localStorage.setItem(key, value);
  }, [value, key])

  return [value, setValue] as const;
}
const initialStories = [
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
const getAsyncStories = (): Promise<{ data: { stories: Story[] } }> =>
  new Promise((resolve) => {
    const retrieveData = () => {
      resolve({
        data: {
          stories: initialStories
        }
      })
    }
    setTimeout(retrieveData, 2000)
  })
type StoriesState = Story[];
type StoriesSetAction = {
  type: typeof ACTIONS.SET_STORIES
  payload: Story[];
}
type StoriesRemoveAction = {
  type: typeof ACTIONS.REMOVE_STORY
  payload: Story
}
type StoriesAction = StoriesSetAction | StoriesRemoveAction
const storiesReducer = (state:StoriesState, action:StoriesAction) => {
  switch (action.type) {
    case ACTIONS.SET_STORIES:
      return action.payload
    case ACTIONS.REMOVE_STORY:
      return state.filter(
        (story: Story) => action.payload.objectID !== story.objectID
      )
    default:
      throw new Error()
  }
}
const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('search', '');
  const [stories, dispatchStories] = React.useReducer(storiesReducer, []);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsLoading(true);
    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: ACTIONS.SET_STORIES,
          payload: result.data.stories || [] // Ensure payload is an array
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching stories:', error); // Log the error for debugging
        setIsError(true);
      })
  }, []);

  const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }
  const searchedStories = stories.filter(function(story:Story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleRemoveStory = (item: Story) => {
    dispatchStories({type: ACTIONS.REMOVE_STORY, payload: item});
  }

  const resetStories = () => {
    dispatchStories({type: ACTIONS.SET_STORIES, payload: initialStories});
  }

  return (
    <div>
    {isError && 'Something went wrong'}
    {
      isLoading ? 'Loading...' :
      <>
        <h1>My Hacker Stories</h1>
        <InputWithLabel
          id='search'
          onInputChange={handleSearch}
          value={searchTerm}
          isFocused // defaults to true
          >
          <strong>Search: </strong>
        </InputWithLabel>
        <hr />
        <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
        <button type='button' onClick={resetStories}>Reset Stories</button>
      </>
    }
    </div>
  );
}

type InputWithLabelProps = {
  id: string,
  value: string,
  type?: string,
  isFocused: boolean,
  children?: React.ReactNode,
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const InputWithLabel = ({
  id,
  value,
  type='text',
  onInputChange,
  isFocused,
  children,
}: InputWithLabelProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label> {/* htmlFor allows clicking on label to put focus in input#search */}
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  )
}

type ListProps = {
  list: Story[];
  onRemoveItem: (item: Story) => void;
}

const List = ({list, onRemoveItem}:ListProps) => (
  <ul>
    {list.map((item) => (
      <Item
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </ul>
);

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
}

const Item = ({item, onRemoveItem}:ItemProps) => {
  const handleRemoveItem = () => {
    onRemoveItem(item);
  }
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <button type='button' onClick={handleRemoveItem}>Dismiss</button>
    </li>
  );
}

export default App