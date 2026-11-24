package ro.pocketrip;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class WebApiApplication
{
    public static void main(String[] args)
    {
        SpringApplication.run(WebApiApplication.class,args);
    }
}
