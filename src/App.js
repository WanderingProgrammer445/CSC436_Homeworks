import ToDoList from './ToDoList';
import UserLine from './UserLine';
import AddToDo from './AddToDo';
import react from 'react';
import { useResource } from 'react-request-hook';
import {useState, useReducer, useEffect} from 'react';
import { ToDoContext, UserContext } from './Contexts';

function App() {
   


   const [ toDos, getToDos ] = useResource(() => ({
        url: '/todos',
        method: 'get'
      }))

    const[toDoDeleted, deleteToDo] = useResource((id)=>({
        url: `/todos/${id}`,
        method: 'delete'
    }))

    const[toDoToggled, toggleToDo] = useResource((id, title, description, dateCreated, complete, dateCompleted)=>({
        url: `/todos/${id}`,
        method: 'put',
        data: {id, title, description, dateCreated, complete, dateCompleted}

    }))

   const [ toDoCreated, createToDo ] = useResource((title, description, dateCreated, complete, dateCompleted) => ({
        url: '/todos',
        method: 'post',
        data: {title, description, dateCreated, complete, dateCompleted}

      }))
    
    function toDoReducer (state, action) {
        switch (action.type) {
           /* case 'CREATE_TODO':
              const newToDo = { 
                  title: action.title,
                  description: action.description,
                  dateCreated: Date.now(),
                  complete: false,
                  dateCompleted: ''
                }
                return [ newToDo, ...state ]
                */
            case 'TOGGLE_TODO':
              return state.map(
                  (todo, i)=>{

                      if(todo.id === action.toDoItemKey){
                          return {... todo, dateCompleted: action.completed?action.date:'', complete: action.completed } 
                        } else {
                            return todo
                        }
                    })
              
            case 'FETCH_TODOS':
                return action.todos;  
            case 'DELETE_TODO':
                return state.filter((todo,i)=>{return todo.id!==action.toDoItemKey})
            default:
               return state;
        }
      }
    useEffect(getToDos,[toDoCreated])

 

    
    const [toDoList, dispatchToDo] = useReducer(toDoReducer,[/*{title: 'Do something', description: 'something', dateCreated: Date.now(), complete: false, dateCompleted: ''}*/]);

    

    useEffect(() => {
        if (toDos && toDos.data) {
            dispatchToDo({ type: 'FETCH_TODOS', todos: toDos.data })
        }
    }, [toDos])

    useEffect(getToDos,[])
    
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
            <ToDoContext.Provider value={{toDoList: toDoList, dispatchToDo: dispatchToDo, createToDo: createToDo, deleteToDo: deleteToDo, toggleToDo: toggleToDo}}>
            <UserLine username={username} dispatchUser={dispatchUser}/>
			{username && <AddToDo username={username} dispatchToDo={dispatchToDo}/>}
			<ToDoList toDoList={toDoList} dispatchToDo={dispatchToDo}/>
            </ToDoContext.Provider>
            </UserContext.Provider>
        </div>
  );
}

export default App;
