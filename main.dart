Import 'package:flutter/material.dart';

// --- Main App Setup ---
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Contacts App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const ContactsListScreen(),
    );
  }
}

// --- Data Model ---
class Contact {
  String id;
  String name;
  String phone;
  String email;

  Contact({
    required this.id,
    required this.name,
    required this.phone,
    required this.email,
  });
}

// --- 1. Main List Screen ---
class ContactsListScreen extends StatefulWidget {
  const ContactsListScreen({super.key});

  @override
  State<ContactsListScreen> createState() => _ContactsListScreenState();
}

class _ContactsListScreenState extends State<ContactsListScreen> {
  // Our "database"
  final List<Contact> _allContacts = [
    Contact(id: '1', name: 'Alice Johnson', phone: '555-1234', email: 'alice@example.com'),
    Contact(id: '2', name: 'Bob Smith', phone: '555-5678', email: 'bob@example.com'),
    Contact(id: '3', name: 'Catherine Lee', phone: '555-9012', email: 'cat@example.com'),
  ];
  
  // List to be displayed (after filtering)
  List<Contact> _filteredContacts = [];
  
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _filteredContacts = _allContacts;
    _searchController.addListener(_filterContacts);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _filterContacts() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredContacts = _allContacts.where((contact) {
        final nameLower = contact.name.toLowerCase();
        final phoneLower = contact.phone.toLowerCase();
        final emailLower = contact.email.toLowerCase();
        return nameLower.contains(query) || phoneLower.contains(query) || emailLower.contains(query);
      }).toList();
    });
  }

  // --- Navigation Methods ---

  void _navigateToDetail(Contact contact) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => DetailScreen(contact: contact)),
    );
  }

  void _navigateToAdd() async {
    // Wait for the FormScreen to pop and return a new contact
    final newContact = await Navigator.push<Contact>(
      context,
      MaterialPageRoute(builder: (context) => const FormScreen()),
    );

    if (newContact != null) {
      // Add to our "database"
      setState(() {
        _allContacts.add(newContact);
        _filterContacts(); // Refresh the filtered list
      });
      // Show SnackBar on success
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Contact added successfully!')),
        );
      }
    }
  }

  void _navigateToEdit(Contact contact) async {
    // Wait for the FormScreen to pop and return the edited contact
    final editedContact = await Navigator.push<Contact>(
      context,
      MaterialPageRoute(builder: (context) => FormScreen(contactToEdit: contact)),
    );

    if (editedContact != null) {
      // Find and update the contact in our "database"
      setState(() {
        final index = _allContacts.indexWhere((c) => c.id == editedContact.id);
        if (index != -1) {
          _allContacts[index] = editedContact;
          _filterContacts(); // Refresh the filtered list
        }
      });
      // Show SnackBar on success
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Contact updated successfully!')),
        );
      }
    }
  }

  // --- Actions ---

  void _showDeleteConfirmation(Contact contact) {
    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          title: const Text('Delete Contact'),
          content: Text('Are you sure you want to delete ${contact.name}?'),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(dialogContext).pop(); // Close the dialog
              },
            ),
            TextButton(
              child: const Text('Delete', style: TextStyle(color: Colors.red)),
              onPressed: () {
                setState(() {
                  _allContacts.removeWhere((c) => c.id == contact.id);
                  _filterContacts(); // Refresh the list
                });
                Navigator.of(dialogContext).pop(); // Close the dialog
              },
            ),
          ],
        );
      },
    );
  }

  void _showContextMenu(BuildContext context, Contact contact, LongPressStartDetails details) {
    final offset = details.globalPosition;
    showMenu(
      context: context,
      position: RelativeRect.fromLTRB(offset.dx, offset.dy, offset.dx, offset.dy),
      items: [
        const PopupMenuItem(value: 'open', child: Text('Open')),
        const PopupMenuItem(value: 'edit', child: Text('Edit')),
        const PopupMenuItem(value: 'delete', child: Text('Delete')),
      ],
    ).then((value) {
      // Handle selection
      if (value == 'open') {
        _navigateToDetail(contact);
      } else if (value == 'edit') {
        _navigateToEdit(contact);
      } else if (value == 'delete') {
        _showDeleteConfirmation(contact);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          decoration: const InputDecoration(
            hintText: 'Search contacts...',
            border: InputBorder.none,
            hintStyle: TextStyle(color: Colors.white70),
          ),
          style: const TextStyle(color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _navigateToAdd,
          ),
        ],
      ),
      body: _filteredContacts.isEmpty
          ? _buildEmptyView()
          : _buildContactsList(),
    );
  }

  Widget _buildEmptyView() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.people_outline, size: 80, color: Colors.grey),
          SizedBox(height: 16),
          Text(
            'No contacts found',
            style: TextStyle(fontSize: 18, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildContactsList() {
    // ListView.separated is lazy-loaded
    return ListView.separated(
      itemCount: _filteredContacts.length,
      separatorBuilder: (context, index) => const Divider(),
      itemBuilder: (context, index) {
        final contact = _filteredContacts[index];
        return GestureDetector(
          // Tap to open detail
          onTap: () => _navigateToDetail(contact),
          // Long press for context menu
          onLongPressStart: (details) => _showContextMenu(context, contact, details),
          child: ListTile(
            leading: CircleAvatar(child: Text(contact.name[0])),
            title: Text(contact.name),
            subtitle: Text(contact.phone),
          ),
        );
      },
    );
  }
}

// --- 2. Detail Screen ---
class DetailScreen extends StatelessWidget {
  final Contact contact;

  const DetailScreen({super.key, required this.contact});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(contact.name),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ListTile(
              leading: const Icon(Icons.person, size: 40),
              title: const Text('Name', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(contact.name, style: const TextStyle(fontSize: 18)),
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.phone, size: 40),
              title: const Text('Phone', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(contact.phone, style: const TextStyle(fontSize: 18)),
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.email, size: 40),
              title: const Text('Email', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(contact.email, style: const TextStyle(fontSize: 18)),
            ),
          ],
        ),
      ),
    );
  }
}

// --- 3. Form Screen (for Add/Edit) ---
class FormScreen extends StatefulWidget {
  final Contact? contactToEdit;

  // If contactToEdit is null, it's an "Add" screen
  // If it's not null, it's an "Edit" screen
  const FormScreen({super.key, this.contactToEdit});

  @override
  State<FormScreen> createState() => _FormScreenState();
}

class _FormScreenState extends State<FormScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _emailController;
  
  bool _isEditMode = false;

  @override
  void initState() {
    super.initState();
    _isEditMode = widget.contactToEdit != null;

    // Prefill fields if editing
    _nameController = TextEditingController(text: widget.contactToEdit?.name);
    _phoneController = TextEditingController(text: widget.contactToEdit?.phone);
    _emailController = TextEditingController(text: widget.contactToEdit?.email);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _saveForm() {
    // Validate inputs
    if (_formKey.currentState!.validate()) {
      // Form is valid, create the contact object
      final contact = Contact(
        // Use existing ID if editing, or create a new unique ID if adding
        id: widget.contactToEdit?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        name: _nameController.text,
        phone: _phoneController.text,
        email: _emailController.text,
      );

      // Pop the screen and return the new/edited contact
      Navigator.pop(context, contact);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditMode ? 'Edit Contact' : 'Add Contact'),
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: _saveForm,
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              _buildTextFormField(
                controller: _nameController,
                labelText: 'Name',
                icon: Icons.person,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextFormField(
                controller: _phoneController,
                labelText: 'Phone',
                icon: Icons.phone,
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a phone number';
                  }
                  // Simple phone validation (you can make this more complex)
                  if (value.length < 5) {
                    return 'Please enter a valid phone number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildTextFormField(
                controller: _emailController,
                labelText: 'Email',
                icon: Icons.email,
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  // Simple email validation
                  if (value != null && value.isNotEmpty && !value.contains('@')) {
                    return 'Please enter a valid email';
                  }
                  return null; // Email is optional in this example
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Helper widget for a styled text field
  Widget _buildTextFormField({
    required TextEditingController controller,
    required String labelText,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: labelText,
        prefixIcon: Icon(icon),
        // All fields must have visible borders
        border: const OutlineInputBorder(),
      ),
      keyboardType: keyboardType,
      // Validate inputs; show inline error messages
      validator: validator,
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }
}

Seperate into differnt files and mody abif
