package com.funnyshare.funnyshare.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Value("${uploadpath}")
    String uploadPath;

    @Bean
    CommandLineRunner createUploadFolder() {
        return (args) -> {
            File uploadFolder = new File(uploadPath);
            boolean uploadFolderExists = uploadFolder.exists() && uploadFolder.isDirectory();
            if (!uploadFolderExists) {
                uploadFolder.mkdir();
            }
        };
    }
}
