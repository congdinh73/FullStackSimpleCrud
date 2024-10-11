package com.employee.controller;


import com.employee.entity.Employee;
import com.employee.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(maxAge = 3600)
@RestController
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/employees/{employeeId}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable("employeeId") Long employeeId) {
        return ResponseEntity.ok(employeeService.getEmployeeById(employeeId));
    }

    @PostMapping("/employees")
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.addEmployee(employee));
    }

    @PatchMapping("/employees/{employeeId}")
    public ResponseEntity<Employee> updateEmployee(@RequestBody Employee employee, @PathVariable("employeeId") Long employeeId) {
        Employee empObj = employeeService.getEmployeeById(employeeId);
        if (empObj != null) {
            empObj.setManager(employee.getManager());
            empObj.setName(employee.getName());
            empObj.setSalary(employee.getSalary());

        }
        return ResponseEntity.ok(employeeService.updateEmployee(employee));
    }

    @DeleteMapping("/employees/{employeeId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable("employeeId") Long employeeId) {
        Employee empObj = employeeService.getEmployeeById(employeeId);
        String deleteMessage = null;
        if (empObj != null) {
            deleteMessage = employeeService.deleteEmployee(empObj);
        }
        return ResponseEntity.ok(deleteMessage);
    }

}
