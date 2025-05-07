package com.sliit.skillshare.Repository;
import com.sliit.skillshare.Model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByUserId(String userId);
    List<Payment> findByStatus(String status);
    Payment findByTransactionId(String transactionId);
}
