-- Migration 14: Revoke Direct RPC Execution of Triggers from anon
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_order_ready() FROM anon;
REVOKE EXECUTE ON FUNCTION public.notify_seller_on_new_order() FROM anon;
REVOKE EXECUTE ON FUNCTION public.notify_buyer_on_order_update() FROM anon;
