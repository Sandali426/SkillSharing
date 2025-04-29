package com.sliit.skillshare.Service;

import com.sliit.skillshare.Model.Payment;
import com.sliit.skillshare.Repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
    public Payment getPaymentById(String id) {
        return paymentRepository.findById(id).orElse(null);
    }
    
    public List<Payment> getPaymentsByUser(String userId) {
        return paymentRepository.findByUserId(userId);
    }
    
    public Payment createPayment(Payment payment) {
        payment.setPaymentDate(new Date());
        payment.setStatus("PENDING");
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setInvoiceNumber("INV-" + System.currentTimeMillis());
        return paymentRepository.save(payment);
    }
    
    public Payment updatePaymentStatus(String id, String status) {
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment != null) {
            payment.setStatus(status);
            return paymentRepository.save(payment);
        }
        return null;
    }
    
    public void deletePayment(String id) {
        paymentRepository.deleteById(id);
    }
    
    public Payment findByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }
}