package com.ricopot.tests;

import static org.testng.Assert.assertTrue;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.WebDriverException;
import org.testng.SkipException;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.ricopot.pages.LoginPage;
import io.github.bonigarcia.wdm.WebDriverManager;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;

@Epic("Salesforce Authentication")
@Feature("Login")
public class ValidLoginTest {
    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeTest
    public void setUp() {
        if (!Boolean.getBoolean("salesforce.liveTests")) {
            throw new SkipException("Live Salesforce tests are disabled. Enable with -Dsalesforce.liveTests=true.");
        }
        if (isBlank(System.getenv("SALESFORCE_USERNAME")) || isBlank(System.getenv("SALESFORCE_PASSWORD"))) {
            throw new SkipException("Set SALESFORCE_USERNAME and SALESFORCE_PASSWORD to run the valid-login test.");
        }

        try {
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--window-size=1440,1000", "--no-sandbox");
            if (Boolean.parseBoolean(System.getProperty("selenium.headless", "true"))) {
                options.addArguments("--headless=new");
            }
            driver = new ChromeDriver(options);
            driver.manage().timeouts().implicitlyWait(java.time.Duration.ZERO);
            loginPage = new LoginPage(driver);
        } catch (WebDriverException exception) {
            throw new IllegalStateException("Unable to initialize Chrome for the valid-login test.", exception);
        }
    }

    @Test
    @Story("Valid credentials")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verifies valid Salesforce credentials redirect away from the login page.")
    public void validCredentialsShouldRedirectFromLoginPage() {
        try {
            loginPage.open();
            loginPage.login(System.getenv("SALESFORCE_USERNAME"), System.getenv("SALESFORCE_PASSWORD"));
            assertTrue(loginPage.hasRedirectedFromLoginPage(),
                    "Expected the valid login flow to redirect away from login.salesforce.com.");
        } catch (IllegalStateException exception) {
            throw new AssertionError("The valid Salesforce login flow could not be completed.", exception);
        }
    }

    @AfterTest(alwaysRun = true)
    public void tearDown() {
        if (driver != null) {
            try {
                driver.quit();
            } catch (WebDriverException exception) {
                throw new IllegalStateException("Unable to close Chrome after the valid-login test.", exception);
            }
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
