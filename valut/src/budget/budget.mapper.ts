export function mapBudgetInputToVault(input: {
  TransactionId: string;
  budgetList: {
    TotalBudget: string;
    Territory: string;
    StartDate: string;
    ExternalId: string;
    EndDate: string;
    BudgetName: string;
  }[];
}): any[] {
  return input.budgetList.map((budget) => ({
    object_type__v: 'OOT00000000V471',
    name__v: budget.BudgetName,
    status__v: 'active__v',
    actual_expenses__v: '',
    local_currency__sys: 'V0V000000000101',
    budget_identifier__v: '',
    child_budget_allocation__v: '',
    committed_expenses__v: '',
    end_date__v: budget.EndDate,
    estimated_expenses__v: '',
    external_id__v: input.TransactionId,
    start_date__v: budget.StartDate,
    em_budget_status__v: 'available_for_use__v',
    territory__v: budget.Territory,
    total_budget__v: Number(budget.TotalBudget),
    parent_budget__v: '',
    product__v: '',
    ownerid__v: 23459555,
    legacy_crm_id__v: budget.ExternalId,
    location_type__v: '',
    nni_event_expenses__c: '',
    event_format__v: '',
  }));
}
