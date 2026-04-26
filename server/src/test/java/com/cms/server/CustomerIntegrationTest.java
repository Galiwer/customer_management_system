package com.cms.server;

import com.cms.server.dto.*;
import com.cms.server.entity.Customer;
import com.cms.server.repository.CustomerRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.cms.server.util.TestResultLogger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(TestResultLogger.class)
public class CustomerIntegrationTest {

        @Autowired
        private MockMvc mvc;

        @Autowired
        private CustomerRepository repo;

        @Autowired
        private ObjectMapper mapper;

        @BeforeEach
        void cleanUp() {
                repo.deleteAll();
        }

        @Test
        void testBasicCrudOperations() throws Exception {
                // Create a new customer
                CustomerRequestDTO req = new CustomerRequestDTO();
                req.setName("Kamal Perera");
                req.setNic("921234567V");
                req.setDob(LocalDate.of(1992, 5, 10));
                req.setMobiles(Collections.singletonList("0771234567"));

                String response = mvc.perform(post("/api/customers")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(mapper.writeValueAsString(req)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Kamal Perera"))
                                .andReturn().getResponse().getContentAsString();

                Long id = mapper.readValue(response, CustomerResponseDTO.class).getId();

                // Update the name
                req.setName("Kamal Updated");
                mvc.perform(put("/api/customers/" + id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(mapper.writeValueAsString(req)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Kamal Updated"));

                // Delete them
                mvc.perform(delete("/api/customers/" + id))
                                .andExpect(status().isOk());
        }

        @Test
        void testFamilyMemberLinking() throws Exception {
                // Create two customers
                Customer c1 = saveCustomer("Parent User", "NIC1");
                Customer c2 = saveCustomer("Child User", "NIC2");

                // Link c2 as family to c1
                CustomerRequestDTO linkReq = new CustomerRequestDTO();
                linkReq.setName(c1.getName());
                linkReq.setNic(c1.getNic());
                linkReq.setDob(c1.getDob());
                linkReq.setFamilyMemberIds(Collections.singletonList(c2.getId()));

                mvc.perform(put("/api/customers/" + c1.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(mapper.writeValueAsString(linkReq)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.familyMembers", hasSize(1)))
                                .andExpect(jsonPath("$.familyMembers[0].name").value("Child User"));
        }

        @Test
        void testExcelBulkUpload() throws Exception {
                // Load the actual sample file
                InputStream is = getClass().getResourceAsStream("/sample_customers.xlsx");
                if (is == null)
                        throw new RuntimeException("Excel resource missing!");

                byte[] bytes = new byte[is.available()];
                is.read(bytes);
                is.close();

                MockMultipartFile file = new MockMultipartFile(
                                "file", "sample_customers.xlsx",
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                bytes);

                // Upload
                mvc.perform(multipart("/api/customers/upload").file(file))
                                .andExpect(status().isOk());

                // Check if Liam Hemsworth from the Excel exists
                mvc.perform(get("/api/customers"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(greaterThan(0))))
                                .andExpect(jsonPath("$[?(@.nic=='901234123V')]").exists())
                                .andExpect(jsonPath("$[?(@.name=='Liam Hemsworth')]").exists());
        }

        @Test
        void testValidationFailure() throws Exception {
                // Try creating without name
                CustomerRequestDTO badReq = new CustomerRequestDTO();
                badReq.setNic("12345");

                mvc.perform(post("/api/customers")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(mapper.writeValueAsString(badReq)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void testDeleteNonExistent() throws Exception {
                mvc.perform(delete("/api/customers/99999"))
                                .andExpect(status().isNotFound());
        }

        private Customer saveCustomer(String name, String nic) {
                Customer c = new Customer();
                c.setName(name);
                c.setNic(nic);
                c.setDob(LocalDate.now());
                return repo.save(c);
        }
}
