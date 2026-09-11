package premeees.lafam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LafamApplication {

	public static void main(String[] args) {
		SpringApplication.run(LafamApplication.class, args);
	}

}
