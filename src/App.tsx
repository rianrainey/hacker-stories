const welcome = {
  title: 'Hey',
  greeting: 'React'
};

function getTitle(title: string){
  return title;
}

function App() {
  return (
    <div>
      <h1>{welcome.title} {getTitle(welcome.greeting)}</h1>

      <label htmlFor="search">Search: </label> {/* htmlFor allows clicking on label to put focus in input#search */}
      <input id="search" type="text" />
    </div>
  )
}

export default App