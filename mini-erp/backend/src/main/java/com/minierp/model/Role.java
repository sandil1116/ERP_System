package com.minierp.model;

/**
 * Roles supported by the system.
 * ADMIN     - full access to every module
 * CASHIER   - sales, customers, view-only inventory
 * STAFF     - inventory in/out, view purchases
 *
 * See Section 2 "User Roles & Permissions" in the system design doc
 * for the full permission matrix. Enforcement happens both on the
 * backend (@PreAuthorize) and the frontend (sidebar + route guards).
 */
public enum Role {
    ADMIN,
    CASHIER,
    STAFF
}
