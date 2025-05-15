-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for kyc_documents table
CREATE POLICY "Users can view their own documents" ON kyc_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON kyc_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for investment_products table
CREATE POLICY "Anyone can view active investment products" ON investment_products
  FOR SELECT

## Next Steps for Implementation

Now that we have our database schema set up, here are the next steps to fully implement the application:

1. **Complete the Database Types**: Update the `types/database.ts` file to include all the tables from our schema.

2. **Implement API Routes**: Create API routes for each table to handle CRUD operations.

3. **Create UI Components**: Build UI components for managing user profiles, KYC documents, and investments.

4. **Implement GDPR Compliance**: Add features for managing user consent and data privacy.

5. **Add Security Policies**: Implement Row Level Security (RLS) policies to secure the database.

6. **Create Admin Dashboard**: Build an admin dashboard for managing users and investments.

7. **Implement Social Authentication**: Add social login options using Supabase Auth providers.

8. **Add Two-Factor Authentication**: Enhance security with 2FA.

9. **Set Up Email Notifications**: Configure email notifications for important account activities.

10. **Create User Onboarding Flow**: Design a step-by-step onboarding process for new users.

## Implementing Social Authentication

Let's start by implementing social authentication, which was one of your active work items:
