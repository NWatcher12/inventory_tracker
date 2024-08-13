'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button, formLabelClasses} from '@mui/material'
import {collection, getDocs, query, setDoc, deleteDoc, doc, getDoc} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [find_open, setFindOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [itemNotFound, setItemNotFound] = useState(true)
  const [search_open, setSearchOpen] = useState(false)

  const updateInventory = async() =>{
    const snapshot = query(collection(firestore,'inventory')) 
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) =>{
      inventoryList.push({
        name:doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity == 1){
        await deleteDoc(docRef)
      } else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }

  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }else{
      await setDoc(docRef, {quantity:1})
    }
    await updateInventory()
  }

  const findItem = async (item) =>{
    const results = inventory.filter(item => item.name.toLowerCase() === itemName.toLowerCase())
    if (results.length === 0) {
      setItemNotFound(true);
    } else {
      setItemNotFound(false);
    }
    setSearchResults(results);
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleFindOpen = () => setFindOpen(true)
  const handleFindClose = () => setFindOpen(false)
  
  useEffect(()=>{
    updateInventory()
  },[])

  return (
    <Box width = "100vw" height = "100vh" display="flex" justifyContent="center" alignItems = "center" gap={2} flexDirection="column">

      <Modal open = {open}
        onClose = {handleClose}>
          <Box
          position = "absolute"
          top = "50%" 
          left = "50%"
          width={400}
          backgroundColor ="white"
          border = "2px solid #000"
          boxShadow={24}
          p = {4}
          display = "flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform:"translate(-50%, -50%)", 
          }}
          >
            <Typography variant="h6">Add item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant='outlined'
                fullWidth
                value = {itemName}
                onChange ={(e)=>{
                  setItemName(e.target.value)
                }}
              />
              <Button
              variant = "outlined"
              onClick = {()=>{
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
              >Add</Button> 
            </Stack>
          </Box>
      </Modal>

      <Modal open = {find_open}
        onClose = {handleFindClose}>
          <Box
          position = "absolute"
          top = "50%" 
          left = "50%"
          width={400}
          backgroundColor ="white"
          border = "2px solid #000"
          boxShadow={24}
          p = {4}
          display = "flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform:"translate(-50%, -50%)", 
          }}
          >
            <Typography variant="h6">Find item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant='outlined'
                fullWidth
                value = {itemName}
                onChange ={(e)=>{
                  setItemName(e.target.value)
                }}
              />
              <Button
              variant = "outlined"
              onClick = {()=>{
                findItem(itemName)
                setItemName('')
                setSearchOpen(true)
                handleFindClose()
              }}
              >Find</Button> 
            </Stack>
          </Box>
      </Modal>

      {/* <Modal open = {search_open}
        onClose = {setSearchOpen(false)}>
           {itemNotFound ? (
            <Typography>No items found</Typography>
          ) : (
            <Typography>Items found</Typography>
            // <Stack width="100%" spacing={2}>
            //   {searchResults.map(({ name, quantity }) => (
            //     <Box
            //       key={name}
            //       fullWidth
            //       display="flex"
            //       alignItems="center"
            //       justifyContent="space-between"
            //       backgroundColor="#f0f0f0"
            //       paddingX={5}
            //     >
            //       <Typography color={"#333"} textAlign={"center"} display={"flex"}>
            //         {name.charAt(0).toUpperCase() + name.slice(1)}
            //       </Typography>
            //       <Typography color={"#333"} textAlign={"center"} display={"flex"}>
            //         {quantity}
            //       </Typography>
            //       <Stack direction="row" spacing={2}>
            //         <Button variant="contained" onClick={() => addItem(name)}>Add</Button>
            //         <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
            //       </Stack>
            //     </Box>
            //   ))}
           
            // </Stack>
            )}
      </Modal> */}
      
      

      <Stack direction="row" spacing={2}>
        <Button variant = "contained"
        onClick={()=>{handleOpen()}}>
          Add New Item
        </Button>

        <Button variant = "contained"
        onClick={()=>{handleFindOpen()}}>
          Find Item
        </Button>
      </Stack>

      <Box border = '1p solid #333'>
        <Box width="800px" height="100px"
        backgroundColor ="#ADD8E6" alignItems="center" justifyContent="center"
        display="flex">
          <Typography variant="h2" color="#333" >
            Inventory Items
          </Typography>
        </Box>


      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {itemNotFound ? (inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              backgroundColor="#f0f0f0"
              paddingX={5}
            >
              <Typography variant="h4" color={"#333"} textAlign={"center"} display={"flex"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant="h4" color={"#333"} textAlign={"center"} display={"flex"}>
                {quantity}</Typography>

              <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => {
                addItem(name)
              }}>Add</Button>
              
              <Button variant="contained" onClick={() => {
                removeItem(name)
              }}>Remove</Button>
              </Stack>

            </Box>
          ))
        ):(
          searchResults.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              backgroundColor="#f0f0f0"
              paddingX={5}
            >
              <Typography variant="h4" color={"#333"} textAlign={"center"} display={"flex"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant="h4" color={"#333"} textAlign={"center"} display={"flex"}>
                {quantity}</Typography>

              <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => {
                addItem(name)
              }}>Add</Button>
              
              <Button variant="contained" onClick={() => {
                removeItem(name)
              }}>Remove</Button>
              </Stack>
            </Box>
          ))
        )}
      </Stack>
      </Box>
    </Box>
  );
}
