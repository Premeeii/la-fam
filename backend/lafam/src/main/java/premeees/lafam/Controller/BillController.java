package premeees.lafam.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import premeees.lafam.Service.BillService;
import premeees.lafam.dto.request.CreateBillRequest;
import premeees.lafam.dto.request.UpdateBillRequest;
import premeees.lafam.dto.response.BillCategoryResponse;
import premeees.lafam.dto.response.BillResponse;

@RestController
@RequestMapping("/api")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping("/groups/{groupId}/bills")
    public ResponseEntity<BillResponse> createBill(
            @PathVariable UUID groupId,
            @Valid @RequestBody CreateBillRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        BillResponse response = billService.createBill(groupId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/groups/{groupId}/bills")
    public ResponseEntity<List<BillResponse>> getGroupBills(
            @PathVariable UUID groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<BillResponse> bills = billService.getGroupBills(groupId, userDetails.getUsername());
        return ResponseEntity.ok(bills);
    }

    @PatchMapping("/groups/{groupId}/bills/{billId}")
    public ResponseEntity<BillResponse> updateBill(
            @PathVariable UUID groupId,
            @PathVariable UUID billId,
            @Valid @RequestBody UpdateBillRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        BillResponse response = billService.updateBill(groupId, billId, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/groups/{groupId}/bills/{billId}")
    public ResponseEntity<Void> deleteBill(
            @PathVariable UUID groupId,
            @PathVariable UUID billId,
            @AuthenticationPrincipal UserDetails userDetails) {
        billService.deleteBill(groupId, billId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bills/categories")
    public ResponseEntity<List<BillCategoryResponse>> getAllCategories() {
        List<BillCategoryResponse> categories = billService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
}
