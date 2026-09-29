package premeees.lafam.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import premeees.lafam.Service.BillService;
import premeees.lafam.dto.request.CreateBillRequest;
import premeees.lafam.dto.request.UpdateBillRequest;
import premeees.lafam.dto.response.BillCategoryResponse;
import premeees.lafam.dto.response.BillResponse;
import premeees.lafam.security.rateLimit.RateLimitException;
import premeees.lafam.security.rateLimit.RateLimitProperties;
import premeees.lafam.security.rateLimit.RateLimitService;

@RestController
@RequestMapping("/api")
public class BillController {

    private final BillService billService;
    private final RateLimitService rateLimitService;
    private final RateLimitProperties rateLimitProperties;

    public BillController(BillService billService, RateLimitService rateLimitService, RateLimitProperties rateLimitProperties) {
        this.billService = billService;
        this.rateLimitService = rateLimitService;
        this.rateLimitProperties = rateLimitProperties;
    }

    @PostMapping("/groups/{groupId}/bills")
    public ResponseEntity<BillResponse> createBill(
            @PathVariable UUID groupId,
            @Valid @RequestBody CreateBillRequest request,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        if (!rateLimitService.tryConsume("createBill:" + ip, rateLimitProperties.billCreate())) {
            throw new RateLimitException("Too many bill creation attempts. Please try again later.");
        }
        BillResponse response = billService.createBill(groupId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/groups/{groupId}/bills")
    public ResponseEntity<Page<BillResponse>> getGroupBills(
            @PathVariable UUID groupId,
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<BillResponse> bills = billService.getGroupBills(groupId, userDetails.getUsername(), pageable);
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

    @GetMapping("/groups/{groupId}/bills/me")
    public ResponseEntity<List<BillResponse>> getMyBillsInGroup(
            @PathVariable UUID groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<BillResponse> bills = billService.getBillsByGroupAndUserId(groupId, userDetails.getUsername());
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/groups/{groupId}/bills/category/{categoryId}")
    public ResponseEntity<List<BillResponse>> getBillsByCategory(
            @PathVariable UUID groupId,
            @PathVariable UUID categoryId,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<BillResponse> bills = billService.getBillsByCategory(groupId, categoryId, userDetails.getUsername());
        return ResponseEntity.ok(bills);
    }

    private String getClientIp(HttpServletRequest request) {
        return request.getRemoteAddr();
    }
}
