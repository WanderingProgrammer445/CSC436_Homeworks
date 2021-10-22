import ToDoList from './ToDoList';
import UserLine from './UserLine';
import AddToDo from './AddToDo';
import react from 'react';
import {useState, useReducer, useResource, useEffect} from 'react';
import { ToDoContext, UserContext } from './Contexts';

function App() {
   


   /* const [ toDos, getToDos ] = useResource(() => ({
        url: '/todos',
        method: 'get'
      }))
    */
    function toDoReducer (state, action) {
        switch (action.type) {
            case 'CREATE_TODO':
              const newToDo = { 
                  title: action.title,
                  description: action.description,
                  dateCreated: Date.now(),
                  complete: false,
                  dateCompleted: ''
                }
                return [ newToDo, ...state ]
            case 'TOGGLE_TODO':
              return state.map(
                  (todo, i)=>{

                      if(i === action.index){
                          return {... todo, dateCompleted: action.completed?Date.now():'', complete: action.completed } 
                        } else {
                            return todo
                        }
                    })
              
              
            case 'DELETE_TODO':
                return state.filter((todo,i)=>{return i!==action.index})
            default:
               return state;
        }
      }


    
    const [toDoList, dispatchToDo] = useReducer(toDoReducer,[{title: 'Do something', description: 'something', dateCreated: Date.now(), complete: false, dateCompleted: ''}]);
/*
    useEffect(() => {
        if (toDos && toDos.data) {
            dispatchToDo({ type: 'FETCH_TODOS', todos: toDos.data })
        }
    }, [toDos])
  */  
    function userReducer (state, action) {
        switch (action.type) {
            case 'LOGIN':
            case 'REGISTER':
                return action.username
            case 'LOGOUT':
                return ''
            default:
                return state;
        }
    }
    
   const [username, dispatchUser] = useReducer(userReducer,"");

    return(
        <div><UserContext.Provider value={{user: username, dispatch: dispatchUser}}>
            <ToDoContext.Provider value={{toDoList: toDoList, dispatchToDo: dispatchToDo}}>
            <UserLine username={username} dispatchUser={dispatchUser}/>
			{username && <AddToDo username={username} dispatchToDo={dispatchToDo}/>}
			<ToDoList toDoList={toDoList} dispatchToDo={dispatchToDo}/>
            </ToDoContext.Provider>
            </UserContext.Provider>
        </div>
  );
}

export default App;
