import * as React from 'react';

type Story = {
  objectID: number,
  url: string,
  title: string,
  author: string,
  num_comments: number,
  points: number
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

const ACTIONS = {
  SET_STORIES: 'SET_STORIES',
  REMOVE_STORY: 'REMOVE_STORY'
}

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
  type: 'SET_STORIES'
  payload: Story[];
};

type StoriesRemoveAction = {
  type: 'REMOVE_STORY';
  payload: Story;
};
type StoriesAction = StoriesSetAction | StoriesRemoveAction;
const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case 'SET_STORIES':
      return action.payload;
    case 'REMOVE_STORY':
      return state.filter(
        (story: Story) => action.payload.objectID !== story.objectID
      );
    default:
      throw new Error();
  }
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

const useStorageState = (key: string, initialState: string) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue] as const;
};


const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: 'SET_STORIES',
          payload: result.data.stories,
        });
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story: Story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {isError && <p>Something went wrong ...</p>}

      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List
          list={searchedStories}
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  );
};

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