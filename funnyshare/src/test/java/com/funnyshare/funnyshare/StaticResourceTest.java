package com.funnyshare.funnyshare;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.*;


import java.io.File;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class StaticResourceTest {

    @Value("${uploadpath}")
    String uploadPath;

    @Test
    public void checkStaticFolder_whenAppIsInitialized_uploadFolderMustExist() {
        File uploadFolder = new File(uploadPath);
        boolean uploadFolderExists = uploadFolder.exists() && uploadFolder.isDirectory();
        assertThat(uploadFolderExists).isTrue();
    }
}
