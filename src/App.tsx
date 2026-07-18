import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BinaryTree from './pages/BinaryTree'
import BST from './pages/BST'
import AVL from './pages/AVL'
import Layout from './components/Layout'

function App() {
    return (<Routes>
      <Route element={<Layout/>}>
      <Route path='/' element={<Home/>}/>
      <Route path='binarytree' element={<BinaryTree/>}/>
      <Route path='bst' element={<BST/>}/>
      <Route path='avl' element={<AVL/>}/> 
      </Route>
    </Routes>);
}

export default App
