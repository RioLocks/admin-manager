// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::{params, Connection, Result};
use tauri::command;
use log::info;
use env_logger;
use serde::Serialize;
use std::process::Command;
use chrono::NaiveDate;
use chrono::Local;

// ----------------------------------------- General models ---------------------------------------------

// -------- Invoices models
#[derive(Serialize)]
struct Invoice {
    id: i32,
    creditor: String,
    concern: String,
    category: String,
    amount: f64,
    due_date: String,
    path: Option<String>,
    description: Option<String>,
    status: String,
    payment_date: Option<String>,
}

#[derive(Serialize)]
struct Creditor {
    id: i32,
    name: String,
}

#[derive(Serialize)]
struct Concern {
    id: i32,
    name: String,
}

#[derive(Serialize)]
struct Category {
    id: i32,
    name: String,
}



// ---------- Admin documents models
#[derive(Serialize)]
struct AdminDocument {
    id: i32,
    admin_doc_concern: String,
    admin_doc_category: String,
    admin_doc_description: String,
    admin_doc_status: String,
    admin_doc_path: String,
}

#[derive(Serialize)]
struct AdminDocumentConcern {
    id: i32,
    name: String,
}

#[derive(Serialize)]
struct AdminDocumentCategory {
    id: i32,
    name: String,
}



// ------------ Revenues models
#[derive(Serialize)]
struct Revenue {
    id: i32,
    source: String,
    revenue_type: String,
    revenue_amount: f64,
    receipt_date: String,
    revenue_description: Option<String>,
    revenue_path: Option<String>,
}

#[derive(Serialize)]
struct Source {
    id: i32,
    name: String,
}

#[derive(Serialize)]
struct RevenueType {
    id: i32,
    name: String,
}


// ------------ Task models
#[derive(Serialize)]
struct Task {
    id: i32,
    title: String,
    description: String,
    status: String,
    priority: String,
    due_date: String,
    creation_date: String,
    category: String,
    attachments: Option<String>,
}

#[derive(Serialize)]
struct TaskCategory {
    id: i32,
    name: String,
}

#[derive(Serialize)]
struct TaskPriority {
    id: i32,
    name: String,
}

#[derive(Serialize)]
struct TaskStatus {
    id: i32,
    name: String,
}

// ----------------------------------------- Initialize database ----------------------------------
fn initialize_db() -> Result<()> {
    let conn = Connection::open("app.db")?;
    // Invoices
    conn.execute(
        "CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY,
            creditor TEXT NOT NULL,
            concern TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            due_date TEXT NOT NULL,
            path TEXT,
            description TEXT,
            status TEXT,
            payment_date TEXT
        )",
        [],
    )?;
    // Creditors
    conn.execute(
        "CREATE TABLE IF NOT EXISTS creditors (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    // Concerns
    conn.execute(
        "CREATE TABLE IF NOT EXISTS concerns (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    // Categories
    conn.execute(
        "CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    // Revenues
    conn.execute(
        "CREATE TABLE IF NOT EXISTS revenues (
            id INTEGER PRIMARY KEY,
            source TEXT NOT NULL,
            revenue_type TEXT NOT NULL,
            revenue_amount REAL NOT NULL,
            receipt_date TEXT NOT NULL,
            revenue_description TEXT,
            revenue_path TEXT
        )",
        [],
    )?;
    // Revenues types
    conn.execute(
        "CREATE TABLE IF NOT EXISTS revenue_types (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    // Sources
    conn.execute(
        "CREATE TABLE IF NOT EXISTS sources (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    // Admin documents
    conn.execute(
        "CREATE TABLE IF NOT EXISTS admin_documents (
            id INTEGER PRIMARY KEY,
            admin_doc_concern TEXT NOT NULL,
            admin_doc_category TEXT NOT NULL,
            admin_doc_description TEXT NOT NULL,
            admin_doc_status TEXT NOT NULL,
            admin_doc_path TEXT NOT NULL
        )",
        [],
    )?;
    // Admin documents concerns
    conn.execute(
        "CREATE TABLE IF NOT EXISTS admin_documents_concerns (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    // Admin documents categories
    conn.execute(
        "CREATE TABLE IF NOT EXISTS admin_documents_categories (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    // Tasks
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL,
            priority TEXT NOT NULL,
            due_date TEXT,
            creation_date TEXT NOT NULL,
            category TEXT,
            attachments TEXT
        )",
        [],
    )?;
    // Task categories
    conn.execute(
        "CREATE TABLE IF NOT EXISTS task_categories (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    // Task priorities
    conn.execute(
        "CREATE TABLE IF NOT EXISTS task_priorities (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    // Task statuses
    conn.execute(
        "CREATE TABLE IF NOT EXISTS task_statuses (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    Ok(())
}

// ------------------------------------ Tasks functions -----------------------------------------

#[command]
fn add_task(
    title: String,
    description: String,
    status: String,
    priority: String,
    due_date: String,
    category: String,
    attachments: Option<String>
) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let current_date = chrono::Local::now().naive_local().to_string();
    conn.execute(
        "INSERT INTO tasks (title, description, status, priority, due_date, creation_date, category, attachments) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![title, description, status, priority, due_date, current_date, category, attachments],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn delete_task(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM tasks WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_tasks() -> Result<Vec<Task>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, title, description, status, priority, due_date, creation_date, category, attachments FROM tasks").map_err(|e| e.to_string())?;
    let task_iter = stmt.query_map([], |row| {
        Ok(Task {
            id: row.get(0)?,
            title: row.get(1)?,
            description: row.get(2)?,
            status: row.get(3)?,
            priority: row.get(4)?,
            due_date: row.get(5)?,
            creation_date: row.get(6)?,
            category: row.get(7)?,
            attachments: row.get(8)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut tasks = Vec::new();
    for task in task_iter {
        tasks.push(task.map_err(|e| e.to_string())?);
    }
    Ok(tasks)
}

#[command]
fn update_task(
    id: i32,
    title: String,
    description: String,
    status: String,
    priority: String,
    due_date: String,
    category: String,
    attachments: Option<String>
) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let current_date = chrono::Local::now().naive_local().to_string();
    conn.execute(
        "UPDATE tasks SET title = ?1, description = ?2, status = ?3, priority = ?4, due_date = ?5, creation_date = ?6, category = ?7, attachments = ?8 WHERE id = ?9",
        params![title, description, status, priority, due_date, current_date, category, attachments, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// Fonctions pour gérer les catégories des tâches
#[command]
fn add_task_category(name: String) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO task_categories (name) VALUES (?1)",
        params![name],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_task_categories() -> Result<Vec<TaskCategory>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name FROM task_categories").map_err(|e| e.to_string())?;
    let task_category_iter = stmt.query_map([], |row| {
        Ok(TaskCategory {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut task_categories = Vec::new();
    for task_category in task_category_iter {
        task_categories.push(task_category.map_err(|e| e.to_string())?);
    }
    Ok(task_categories)
}

#[command]
fn delete_task_category(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM task_categories WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// Fonctions pour gérer les priorités des tâches
#[command]
fn add_task_priority(name: String) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO task_priorities (name) VALUES (?1)",
        params![name],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_task_priorities() -> Result<Vec<TaskPriority>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name FROM task_priorities").map_err(|e| e.to_string())?;
    let task_priority_iter = stmt.query_map([], |row| {
        Ok(TaskPriority {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut task_priorities = Vec::new();
    for task_priority in task_priority_iter {
        task_priorities.push(task_priority.map_err(|e| e.to_string())?);
    }
    Ok(task_priorities)
}

#[command]
fn delete_task_priority(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM task_priorities WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// Fonctions pour gérer les statuts des tâches
#[command]
fn add_task_status(name: String) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO task_statuses (name) VALUES (?1)",
        params![name],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_task_statuses() -> Result<Vec<TaskStatus>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name FROM task_statuses").map_err(|e| e.to_string())?;
    let task_status_iter = stmt.query_map([], |row| {
        Ok(TaskStatus {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut task_statuses = Vec::new();
    for task_status in task_status_iter {
        task_statuses.push(task_status.map_err(|e| e.to_string())?);
    }
    Ok(task_statuses)
}

#[command]
fn delete_task_status(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM task_statuses WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}


// ------------------------------------ Admin_Docs functions -----------------------------------------
#[command]
fn add_admin_doc(
    admin_doc_concern: String,
    admin_doc_category: String,
    admin_doc_description: String,
    admin_doc_status: String,
    admin_doc_path: String
) -> Result<(), String> {
    // Ouvrir une connexion à la base de données SQLite
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;

    // Exécuter une commande SQL pour insérer les données dans la table 
    conn.execute(
        "INSERT INTO admin_documents (admin_doc_concern, admin_doc_category, admin_doc_description, admin_doc_status, admin_doc_path) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![admin_doc_concern, admin_doc_category, admin_doc_description, admin_doc_status, admin_doc_path],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
fn get_admin_docs() -> Result<Vec<AdminDocument>, String> {
    // Ouvrir une connexion à la base de données SQLite
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;

    // Exécuter une commande SQL pour récupérer les données de la table
    let mut stmt = conn.prepare("SELECT * FROM admin_documents").map_err(|e| e.to_string())?;
    let admin_doc_iter = stmt.query_map([], |row| {
        Ok(AdminDocument {
            id: row.get(0)?,
            admin_doc_concern: row.get(1)?,
            admin_doc_category: row.get(2)?,
            admin_doc_description: row.get(3)?,
            admin_doc_status: row.get(4)?,
            admin_doc_path: row.get(5)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut admin_docs = Vec::new();
    for admin_doc in admin_doc_iter {
        admin_docs.push(admin_doc.map_err(|e| e.to_string())?);
    }

    Ok(admin_docs)
}

#[command]
fn delete_admin_doc(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM admin_documents WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// Admin document concern functions
#[command]
fn add_admin_document_concern(name: String) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO admin_documents_concerns (name) VALUES (?1)",
        params![name],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_admin_document_concerns() -> Result<Vec<AdminDocumentConcern>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name FROM admin_documents_concerns").map_err(|e| e.to_string())?;
    let admin_document_concern_iter = stmt.query_map([], |row| {
        Ok(AdminDocumentConcern {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut admin_documents_concerns = Vec::new();
    for admin_document_concern in admin_document_concern_iter {
        admin_documents_concerns.push(admin_document_concern.map_err(|e| e.to_string())?);
    }
    Ok(admin_documents_concerns)
}

#[command]
fn delete_admin_document_concern(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM admin_documents_concerns WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// Admin document category functions
#[command]
fn add_admin_document_category(name: String) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO admin_documents_categories (name) VALUES (?1)",
        params![name],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_admin_document_categories() -> Result<Vec<AdminDocumentCategory>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name FROM admin_documents_categories").map_err(|e| e.to_string())?;
    let admin_document_category_iter = stmt.query_map([], |row| {
        Ok(AdminDocumentCategory {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut admin_documents_categories = Vec::new();
    for admin_document_category in admin_document_category_iter {
        admin_documents_categories.push(admin_document_category.map_err(|e| e.to_string())?);
    }
    Ok(admin_documents_categories)
}

#[command]
fn delete_admin_document_category(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM admin_documents_categories WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}


// ------------------------------------ Invoices functions -----------------------------------------
#[command]
fn add_invoice(
    creditor: String, 
    concern: String, 
    category: String, 
    amount: f64, 
    due_date: String, 
    path: Option<String>, 
    description: Option<String>, 
    status: Option<String>, 
    payment_date: Option<String>
) -> Result<(), String> {
    info!("Received arguments:");
    info!("creditor: {}", creditor);
    info!("concern: {}", concern);
    info!("category: {}", category);
    info!("amount: {}", amount);
    info!("due_date: {}", due_date);
    info!("path: {:?}", path);
    info!("description: {:?}", description);
    info!("status: {:?}", status);
    info!("payment_date: {:?}", payment_date);

    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO invoices (creditor, concern, category, amount, due_date, path, description, status, payment_date) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![creditor, concern, category, amount, due_date, path, description, status, payment_date],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_invoices() -> Result<Vec<Invoice>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    
    // Récupérer toutes les factures
    let mut stmt = conn.prepare("SELECT id, creditor, concern, category, amount, due_date, path, description, status, payment_date FROM invoices").map_err(|e| e.to_string())?;
    let invoice_iter = stmt.query_map([], |row| {
        Ok(Invoice {
            id: row.get(0)?,
            creditor: row.get(1)?,
            concern: row.get(2)?,
            category: row.get(3)?,
            amount: row.get(4)?,
            due_date: row.get(5)?,
            path: row.get(6)?,
            description: row.get(7)?,
            status: row.get(8)?,
            payment_date: row.get(9)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut invoices = Vec::new();
    let current_date = Local::now().naive_local().date();

    // Vérifier et mettre à jour les statuts
    for invoice in invoice_iter {
        let mut invoice = invoice.map_err(|e| e.to_string())?;
        if invoice.status == "Open" && NaiveDate::parse_from_str(&invoice.due_date, "%Y-%m-%d").map_err(|e| e.to_string())? < current_date {
            invoice.status = "Retard".to_string();
            conn.execute(
                "UPDATE invoices SET status = ?1 WHERE id = ?2",
                params![invoice.status, invoice.id],
            ).map_err(|e| e.to_string())?;
        }
        invoices.push(invoice);
    }

    Ok(invoices)
}

#[command]
fn delete_invoice(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM invoices WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn pay_invoice(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let payment_date = chrono::Local::now().naive_local().date().to_string();
    let status = "Paye".to_string();

    conn.execute(
        "UPDATE invoices SET payment_date = ?1, status = ?2 WHERE id = ?3",
        params![payment_date, status, id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}


// ------------------------------------ Revenues functions -----------------------------------------

#[command]
fn add_revenue(
    source: String,
    revenue_type: String,
    revenue_amount: f64,
    receipt_date: String,
    revenue_description: Option<String>,
    revenue_path: Option<String>
) -> Result<(), String> {
    // Ouvrir une connexion à la base de données SQLite
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;

    // Exécuter une commande SQL pour insérer les données dans la table 'revenues'
    conn.execute(
        "INSERT INTO revenues (source, revenue_type, revenue_amount, receipt_date, revenue_description, revenue_path) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![source, revenue_type, revenue_amount, receipt_date, revenue_description, revenue_path],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
fn get_revenues() -> Result<Vec<Revenue>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, source, revenue_type, revenue_amount, receipt_date, revenue_description, revenue_path FROM revenues").map_err(|e| e.to_string())?;
    let revenue_iter = stmt.query_map([], |row| {
        Ok(Revenue {
            id: row.get(0)?,
            source: row.get(1)?,
            revenue_type: row.get(2)?,
            revenue_amount: row.get(3)?,
            receipt_date: row.get(4)?,
            revenue_description: row.get(5)?,
            revenue_path: row.get(6)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut revenues = Vec::new();
    for revenue in revenue_iter {
        revenues.push(revenue.map_err(|e| e.to_string())?);
    }
    Ok(revenues)
}

#[command]
fn delete_revenue(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM revenues WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// sources
#[command]
fn add_source(name: String) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO sources (name) VALUES (?1)",
        params![name],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_sources() -> Result<Vec<Source>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name FROM sources").map_err(|e| e.to_string())?;
    let source_iter = stmt.query_map([], |row| {
        Ok(Source {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut sources = Vec::new();
    for source in source_iter {
        sources.push(source.map_err(|e| e.to_string())?);
    }
    Ok(sources)
}

#[command]
fn delete_source(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM sources WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// revenue_types
#[command]
fn add_revenue_type(name: String) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO revenue_types (name) VALUES (?1)",
        params![name],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_revenue_types() -> Result<Vec<RevenueType>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name FROM revenue_types").map_err(|e| e.to_string())?;
    let revenue_type_iter = stmt.query_map([], |row| {
        Ok(RevenueType {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut revenue_types = Vec::new();
    for revenue_type in revenue_type_iter {
        revenue_types.push(revenue_type.map_err(|e| e.to_string())?);
    }
    Ok(revenue_types)
}

#[command]
fn delete_revenue_type(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM revenue_types WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// ------------------------------------ Creditors functions -----------------------------------------
#[command]
fn add_creditor(name: String) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO creditors (name) VALUES (?1)",
        params![name],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_creditors() -> Result<Vec<Creditor>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name FROM creditors").map_err(|e| e.to_string())?;
    let creditor_iter = stmt.query_map([], |row| {
        Ok(Creditor {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut creditors = Vec::new();
    for creditor in creditor_iter {
        creditors.push(creditor.map_err(|e| e.to_string())?);
    }
    Ok(creditors)
}

#[command]
fn delete_creditor(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM creditors WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// ------------------------------------ Concerns functions -----------------------------------------
#[command]
fn add_concern(name: String) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO concerns (name) VALUES (?1)",
        params![name],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_concerns() -> Result<Vec<Concern>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name FROM concerns").map_err(|e| e.to_string())?;
    let concern_iter = stmt.query_map([], |row| {
        Ok(Concern {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut concerns = Vec::new();
    for concern in concern_iter {
        concerns.push(concern.map_err(|e| e.to_string())?);
    }
    Ok(concerns)
}

#[command]
fn delete_concern(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM concerns WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// ------------------------------------ Categories functions -----------------------------------------
#[command]
fn add_category(name: String) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO categories (name) VALUES (?1)",
        params![name],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn get_categories() -> Result<Vec<Category>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name FROM categories").map_err(|e| e.to_string())?;
    let category_iter = stmt.query_map([], |row| {
        Ok(Category {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut categories = Vec::new();
    for category in category_iter {
        categories.push(category.map_err(|e| e.to_string())?);
    }
    Ok(categories)
}

#[command]
fn delete_category(id: i32) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM categories WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// ------------------------------------ Utils functions -----------------------------------------
#[command]
fn open_file(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

fn main() {
    env_logger::init();

    // Initialize the database
    initialize_db().expect("Failed to initialize the database");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            add_invoice,
            get_invoices,
            delete_invoice,
            pay_invoice,
            add_creditor,
            get_creditors,
            delete_creditor,
            add_category,
            get_categories,
            delete_category,
            add_concern,
            get_concerns,
            delete_concern,
            open_file,
            add_revenue,
            get_revenues,
            delete_revenue,
            add_source,
            get_sources,
            delete_source,
            add_revenue_type,
            get_revenue_types,
            delete_revenue_type,
            add_admin_doc,
            get_admin_docs,
            delete_admin_doc,
            add_admin_document_category,
            get_admin_document_categories,
            delete_admin_document_category,
            add_admin_document_concern,
            get_admin_document_concerns,
            delete_admin_document_concern,
            add_task,
            get_tasks,
            delete_task,
            update_task,
            add_task_category,
            get_task_categories,
            delete_task_category,
            add_task_priority,
            get_task_priorities,
            delete_task_priority,
            add_task_status,
            get_task_statuses,
            delete_task_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
