package com.cms.server.util;

import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TestResultLogger implements TestWatcher {

    private static final String REPORT_PATH = "../automated_test_report.md";
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    static {
        try {

            Files.write(Paths.get(REPORT_PATH), ("# Automated Test Execution Report\n\n" +
                    "**Last Run:** " + LocalDateTime.now().format(formatter) + "\n\n" +
                    "| Test Case | Status | Details |\n" +
                    "| :--- | :--- | :--- |\n").getBytes());
        } catch (IOException e) {
            System.err.println("Failed to initialize test report: " + e.getMessage());
        }
    }

    @Override
    public void testSuccessful(ExtensionContext context) {
        logResult(context.getDisplayName(), "PASSED", "Execution completed successfully");
    }

    @Override
    public void testFailed(ExtensionContext context, Throwable cause) {
        String detail = cause.getMessage() != null ? cause.getMessage().replace("|", "\\|")
                : "No error message provided";
        logResult(context.getDisplayName(), "FAILED", detail);
    }

    @Override
    public void testAborted(ExtensionContext context, Throwable cause) {
        logResult(context.getDisplayName(), "ABORTED", cause.getMessage());
    }

    @Override
    public void testDisabled(ExtensionContext context, java.util.Optional<String> reason) {
        logResult(context.getDisplayName(), "SKIPPED", reason.orElse("No reason"));
    }

    private void logResult(String testName, String status, String reason) {
        try (FileWriter fw = new FileWriter(REPORT_PATH, true)) {

            String humanName = testName.replaceAll("([A-Z])", " $1").trim();
            fw.write(String.format("| %s | %s | %s |\n", humanName, status, reason));
        } catch (IOException e) {
            System.err.println("Failed to write to test report: " + e.getMessage());
        }
    }
}
