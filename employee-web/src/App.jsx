import { useState } from 'react'
import './App.css'
import {useTable, useGlobalFilter, useSortBy} from 'react-table'
import * as React from 'react'
import axios from 'axios'

function App() {
  
  
  const [employees, setEmployees] = useState([])
  const columns = React.useMemo(() => [
    {Header: 'EmployeeId', accessor: 'employeeId'},
    {Header: 'Name', accessor: 'name'},
    {Header: 'Manager', accessor: 'manager'},
    {Header: 'Salary', accessor: 'salary'},
    {Header: 'Edit', id: 'Edit', accessor: 'edit',
      Cell:props => (
        <button className='btnEdit' onClick={() =>handleUpdate(props.cell.row.original)}>Edit</button>
      )
    },
    {Header: 'Delete', id: 'Delete', accessor: 'delete',
      Cell: props => (
        <button className='btnDelete' onClick={() =>handleDelete(props.cell.row.original)}>Delete</button>
      )
    },
  ], []);

  const data = React.useMemo(() => employees, []);
  const {getTableProps,getTableBodyProps,headerGroups,rows,prepareRow,state,setGlobalFilter} = useTable({columns, data:employees}, useGlobalFilter, useSortBy);
  const {globalFilter} = state;
  const [showCancel, setShowCancel] = useState(false);
  const [employeeData, setEmployeeData] = useState({name:"", manager:"", salary:""});
  const [errMsg, setErrMsg] = useState("");
  const getAllEmployees = () => {
    axios.get('http://localhost:8080/employees').then((res) => {
      console.log(res.data)
      setEmployees(res.data)
    });
  }

  const clearAll = () => {
    setEmployeeData({name:"", manager:"", salary:""});
    getAllEmployees();
  }

  const handleChangle = (e) => {
    setEmployeeData({...employeeData, [e.target.name]: e.target.value});
  }

  const handleSubmit =async (e) => {
    e.preventDefault();
    if(!employeeData.name || !employeeData.manager || !employeeData.salary){
      setErrMsg("All fields are required");
      return;
    }
    if(employeeData.employeeId){
      await axios.patch(`http://localhost:8080/employees/${employeeData.employeeId}`, employeeData).then((res) => {
        console.log(res.data);
      });
    } else {
      await axios.post('http://localhost:8080/employees', employeeData).then((res) => {
        console.log(res.data);
      });
    }

    clearAll();
  }

  const handleUpdate= (employee) => {
    setEmployeeData(employee);
    setShowCancel(true);
  }

  const handleCancel = () => {
    setEmployeeData({name:"", manager:"", salary:""});
    setShowCancel(false);
  }

  const handleDelete = async(emp) => {
    const isConfirm = window.confirm("Are you sure you want to delete this employee?");
    if (isConfirm){ 
      await axios.delete(`http://localhost:8080/employees/${emp.employeeId}`).then((res) => {
        console.log(res.data);
        setEmployees(res.data);
      });
    }
    window.location.reload();
  }
   React.useEffect(() =>{
    getAllEmployees();
   },[]);
  

  return (
    <>
      <div className='main-container'>
        <h3>Full Stack Crud Using React, Spring Boot & PostgreSQL</h3>
        {errMsg && <p className='errMsg'>{errMsg}</p>}
        <div className='add-panel'>
          <div className='addpaneldiv'>
              <label htmlFor="name">Name</label><br/>
              <input className='addpanelinput' value={employeeData.name} onChange={handleChangle} type="text" name="name" id="name" />
          </div>
          <div className='addpaneldiv'>
              <label htmlFor="manager">Manager</label><br/>
              <input className='addpanelinput' value={employeeData.manager} onChange={handleChangle} type="text" name="manager" id="manager" />
          </div>
          <div className='addpaneldiv'>
              <label htmlFor="salary">Salary</label><br/>
              <input className='addpanelinput' value={employeeData.salary} onChange={handleChangle} type="text" name="salary" id="salary" />
          </div>

          <button className='addBtn' type='submit' onClick={handleSubmit}>{employeeData.employeeId ? "Update" : "Add"}</button>
          <button className='cancelBtn' disabled={!showCancel} onClick={handleCancel}>Cancel</button>
        </div>
        <input  className="search-input" value={globalFilter || ""} onChange={(e) =>setGlobalFilter(e.target.value)} type="search" name="inputSearch" id="inputSearch" placeholder='Search Employee Here'/>
      </div>
      <table className='table' {...getTableProps()}>
        <thead>
          {headerGroups.map((hg)=> (
             <tr {...hg.getHeaderGroupProps()} key={hg.id}> 
             {hg.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}> {column.render("Header")} 
              {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
              </th>
              ))}
             
           </tr>
          ))}
         
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (<tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()} key={cell.column.id}> {cell.render("Cell")} </td>
                })}

              </tr>)

          })}

        </tbody>
      </table>
    </>
  )
}

export default App
