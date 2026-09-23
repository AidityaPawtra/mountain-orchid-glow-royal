import { Head, usePage } from "@inertiajs/react";
import { AppShell } from "@/components/layout/app-shell";
import {
  CalendarDays,
  Eye,
  HandCoins,
  Pencil,
  Plus,
  Search,
  Trash2,
  WalletCards,
} from "lucide-react";
import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  mapSavingsLoan,
  mapSavingsLoanPayment,
} from "@/lib/mapper";
import { submitToServer } from "@/lib/submit";
import type {
  SavingsLoanPayment,
  SavingsLoanRecord,
} from "@/lib/types";

// ======================================================
// ROUTE
// ======================================================



// ======================================================
// FORM TYPE
// ======================================================

type LoanFormData = {
  borrowerName: string;
  phone: string;
  address: string;
  loanDate: string;
  dueDate: string;
  loanAmount: string;
  installmentAmount: string;
  purpose: string;
  notes: string;
};

type PaymentFormData = {
  paymentDate: string;
  amount: string;
  notes: string;
};

const emptyLoanForm: LoanFormData = {
  borrowerName: "",
  phone: "",
  address: "",
  loanDate: "",
  dueDate: "",
  loanAmount: "",
  installmentAmount: "",
  purpose: "",
  notes: "",
};

const emptyPaymentForm: PaymentFormData = {
  paymentDate: "",
  amount: "",
  notes: "",
};

// ======================================================
// HELPERS
// ======================================================

function formatCurrency(
  value: number,
) {
  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    },
  ).format(value);
}

function formatDate(
  value: string,
) {
  if (!value) {
    return "-";
  }

  const date =
    new Date(
      `${value}T00:00:00`,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function todayValue() {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

function getRemaining(
  loan: SavingsLoanRecord,
) {
  return Math.max(
    0,
    loan.loanAmount -
      loan.totalPaid,
  );
}

function getStatusLabel(
  status: SavingsLoanRecord["status"],
) {
  switch (status) {
    case "paid":
      return "Lunas";

    case "overdue":
      return "Jatuh Tempo";

    default:
      return "Aktif";
  }
}

function getStatusClass(
  status: SavingsLoanRecord["status"],
) {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "overdue":
      return "bg-red-50 text-red-700 ring-red-200";

    default:
      return "bg-amber-50 text-amber-700 ring-amber-200";
  }
}

// ======================================================
// PAGE
// ======================================================

function SimpanPinjamPage() {
  // Data simpan pinjam berasal dari database
  // (SavingsLoanController@index)
  const {
    savingsLoans: rawSavingsLoans,
    savingsLoanPayments: rawPayments,
  } = usePage<{
    savingsLoans: unknown[];
    savingsLoanPayments: unknown[];
  }>().props;

  const savingsLoans: SavingsLoanRecord[] = useMemo(
    () =>
      Array.isArray(rawSavingsLoans)
        ? rawSavingsLoans.map(mapSavingsLoan)
        : [],
    [rawSavingsLoans],
  );

  const savingsLoanPayments: SavingsLoanPayment[] = useMemo(
    () =>
      Array.isArray(rawPayments)
        ? rawPayments.map(mapSavingsLoanPayment)
        : [],
    [rawPayments],
  );

  // ====================================================
  // STATE
  // ====================================================

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | SavingsLoanRecord["status"]
    >("all");

  const [formOpen, setFormOpen] =
    useState(false);

  const [detailOpen, setDetailOpen] =
    useState(false);

  const [paymentOpen, setPaymentOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [editingLoanId, setEditingLoanId] =
    useState<string | null>(
      null,
    );

  const [selectedLoanId, setSelectedLoanId] =
    useState<string | null>(
      null,
    );

  const [deletingLoanId, setDeletingLoanId] =
    useState<string | null>(
      null,
    );

  const [loanForm, setLoanForm] =
    useState<LoanFormData>(
      emptyLoanForm,
    );

  const [paymentForm, setPaymentForm] =
    useState<PaymentFormData>(
      emptyPaymentForm,
    );

  // ====================================================
  // SELECTED DATA
  // ====================================================

  const selectedLoan =
    savingsLoans.find(
      (loan) =>
        loan.id ===
        selectedLoanId,
    ) ?? null;

  const deletingLoan =
    savingsLoans.find(
      (loan) =>
        loan.id ===
        deletingLoanId,
    ) ?? null;

  // ====================================================
  // FILTER
  // ====================================================

  const filteredLoans =
    savingsLoans.filter(
      (loan) => {
        const keyword =
          search
            .trim()
            .toLowerCase();

        const matchesSearch =
          !keyword ||
          loan.borrowerName
            .toLowerCase()
            .includes(keyword) ||
          loan.phone
            .toLowerCase()
            .includes(keyword) ||
          loan.purpose
            .toLowerCase()
            .includes(keyword);

        const matchesStatus =
          statusFilter ===
            "all" ||
          loan.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      },
    );

  // ====================================================
  // SUMMARY
  // ====================================================

  const totalLoan =
    savingsLoans.reduce(
      (
        total,
        loan,
      ) =>
        total +
        loan.loanAmount,
      0,
    );

  const totalPaid =
    savingsLoans.reduce(
      (
        total,
        loan,
      ) =>
        total +
        loan.totalPaid,
      0,
    );

  const totalRemaining =
    savingsLoans.reduce(
      (
        total,
        loan,
      ) =>
        total +
        getRemaining(loan),
      0,
    );

  const activeCount =
    savingsLoans.filter(
      (loan) =>
        loan.status ===
        "active",
    ).length;

  const overdueCount =
    savingsLoans.filter(
      (loan) =>
        loan.status ===
        "overdue",
    ).length;

  // ====================================================
  // ADD
  // ====================================================

  function openAddForm() {
    setEditingLoanId(null);

    setLoanForm({
      ...emptyLoanForm,
      loanDate:
        todayValue(),
    });

    setFormOpen(true);
  }

  // ====================================================
  // EDIT
  // ====================================================

  function openEditForm(
    loan: SavingsLoanRecord,
  ) {
    setEditingLoanId(
      loan.id,
    );

    setLoanForm({
      borrowerName:
        loan.borrowerName,
      phone: loan.phone,
      address: loan.address,
      loanDate:
        loan.loanDate,
      dueDate:
        loan.dueDate,
      loanAmount:
        String(
          loan.loanAmount,
        ),
      installmentAmount:
        String(
          loan.installmentAmount,
        ),
      purpose:
        loan.purpose,
      notes: loan.notes,
    });

    setFormOpen(true);
  }

  // ====================================================
  // DETAIL
  // ====================================================

  function openDetail(
    loan: SavingsLoanRecord,
  ) {
    setSelectedLoanId(
      loan.id,
    );

    setDetailOpen(true);
  }

  // ====================================================
  // PAYMENT
  // ====================================================

  function openPayment(
    loan: SavingsLoanRecord,
  ) {
    const remaining =
      getRemaining(loan);

    if (remaining <= 0) {
      toast.info(
        "Pinjaman ini sudah lunas.",
      );
      return;
    }

    setSelectedLoanId(
      loan.id,
    );

    setPaymentForm({
      paymentDate:
        todayValue(),
      amount: "",
      notes: "",
    });

    setPaymentOpen(true);
  }

  // ====================================================
  // DELETE
  // ====================================================

  function openDelete(
    loan: SavingsLoanRecord,
  ) {
    setDeletingLoanId(
      loan.id,
    );

    setDeleteOpen(true);
  }

  // ====================================================
  // SAVE LOAN
  // ====================================================

  async function handleLoanSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const borrowerName =
      loanForm.borrowerName.trim();

    const phone =
      loanForm.phone.trim();

    const address =
      loanForm.address.trim();

    const purpose =
      loanForm.purpose.trim();

    const notes =
      loanForm.notes.trim();

    const loanAmount =
      Number(
        loanForm.loanAmount,
      );

    const installmentAmount =
      Number(
        loanForm.installmentAmount,
      );

    if (!borrowerName) {
      toast.error(
        "Nama peminjam wajib diisi.",
      );
      return;
    }

    if (!phone) {
      toast.error(
        "Nomor HP wajib diisi.",
      );
      return;
    }

    if (!address) {
      toast.error(
        "Alamat wajib diisi.",
      );
      return;
    }

    if (!loanForm.loanDate) {
      toast.error(
        "Tanggal pinjaman wajib diisi.",
      );
      return;
    }

    if (!loanForm.dueDate) {
      toast.error(
        "Tanggal jatuh tempo wajib diisi.",
      );
      return;
    }

    if (
      loanForm.dueDate <
      loanForm.loanDate
    ) {
      toast.error(
        "Tanggal jatuh tempo tidak boleh sebelum tanggal pinjaman.",
      );
      return;
    }

    if (
      loanAmount <= 0
    ) {
      toast.error(
        "Jumlah pinjaman harus lebih dari 0.",
      );
      return;
    }

    if (
      installmentAmount <= 0
    ) {
      toast.error(
        "Nominal angsuran harus lebih dari 0.",
      );
      return;
    }

    if (
      installmentAmount >
      loanAmount
    ) {
      toast.error(
        "Nominal angsuran tidak boleh lebih besar dari jumlah pinjaman.",
      );
      return;
    }

    if (!purpose) {
      toast.error(
        "Keperluan pinjaman wajib diisi.",
      );
      return;
    }

    const payload = {
      borrowerName,
      phone,
      address,
      loanDate: loanForm.loanDate,
      dueDate: loanForm.dueDate,
      loanAmount,
      installmentAmount,
      purpose,
      notes,
    };

    if (editingLoanId) {
      const currentLoan =
        savingsLoans.find(
          (loan) =>
            loan.id ===
            editingLoanId,
        );

      if (!currentLoan) {
        toast.error(
          "Data pinjaman tidak ditemukan.",
        );
        return;
      }

      const result =
        await submitToServer(
          "put",
          `/simpan-pinjam/${editingLoanId}`,
          payload,
        );

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(
        "Data pinjaman berhasil diperbarui.",
      );
    } else {
      const result =
        await submitToServer(
          "post",
          "/simpan-pinjam",
          payload,
        );

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(
        "Pinjaman berhasil ditambahkan.",
      );
    }

    setFormOpen(false);
    setEditingLoanId(null);
    setLoanForm({
      ...emptyLoanForm,
    });
  }

  // ====================================================
  // SAVE PAYMENT
  // ====================================================

  async function handlePaymentSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedLoan) {
      toast.error(
        "Data pinjaman tidak ditemukan.",
      );
      return;
    }

    const amount =
      Number(
        paymentForm.amount,
      );

    const remaining =
      getRemaining(
        selectedLoan,
      );

    if (
      !paymentForm.paymentDate
    ) {
      toast.error(
        "Tanggal pembayaran wajib diisi.",
      );
      return;
    }

    if (amount <= 0) {
      toast.error(
        "Nominal pembayaran harus lebih dari 0.",
      );
      return;
    }

    if (
      amount > remaining
    ) {
      toast.error(
        `Pembayaran tidak boleh lebih dari sisa pinjaman ${formatCurrency(
          remaining,
        )}.`,
      );
      return;
    }

    const result =
      await submitToServer(
        "post",
        `/simpan-pinjam/${selectedLoan.id}/payment`,
        {
          paymentDate:
            paymentForm.paymentDate,
          amount,
          notes:
            paymentForm.notes.trim(),
        },
      );

    if (!result.ok) {
      toast.error(
        result.message ??
          "Pembayaran gagal disimpan.",
      );
      return;
    }

    toast.success(
      "Pembayaran berhasil dicatat.",
    );

    setPaymentOpen(false);

    setPaymentForm({
      ...emptyPaymentForm,
    });
  }

  // ====================================================
  // DELETE
  // ====================================================

  async function handleDelete() {
    if (!deletingLoanId) {
      return;
    }

    const loanExists =
      savingsLoans.some(
        (loan) =>
          loan.id ===
          deletingLoanId,
      );

    if (!loanExists) {
      toast.error(
        "Data pinjaman tidak ditemukan.",
      );
      return;
    }

    const result =
      await submitToServer(
        "delete",
        `/simpan-pinjam/${deletingLoanId}`,
      );

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(
      "Data pinjaman berhasil dihapus.",
    );

    if (
      selectedLoanId ===
      deletingLoanId
    ) {
      setSelectedLoanId(null);
      setDetailOpen(false);
    }

    setDeleteOpen(false);
    setDeletingLoanId(null);
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      <Head title="Simpan Pinjam - BUMDes Desa Wengkal" />
      <div className="space-y-6 pb-8">
      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <HandCoins className="size-4" />

            <span>
              Keuangan BUMDes
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Simpan Pinjam
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Kelola pinjaman uang,
            pembayaran angsuran,
            dan riwayat transaksi.
          </p>
        </div>

        <Button
          type="button"
          className="gap-2"
          onClick={
            openAddForm
          }
        >
          <Plus className="size-4" />
          Tambah Pinjaman
        </Button>
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={WalletCards}
          title="Total Pinjaman"
          value={formatCurrency(
            totalLoan,
          )}
          description={`${savingsLoans.length} data pinjaman`}
        />

        <SummaryCard
          icon={HandCoins}
          title="Sudah Dibayar"
          value={formatCurrency(
            totalPaid,
          )}
          description="Total pembayaran masuk"
        />

        <SummaryCard
          icon={WalletCards}
          title="Sisa Pinjaman"
          value={formatCurrency(
            totalRemaining,
          )}
          description="Total kewajiban peminjam"
        />

        <SummaryCard
          icon={CalendarDays}
          title="Status Pinjaman"
          value={`${activeCount} Aktif`}
          description={`${overdueCount} jatuh tempo`}
        />
      </div>

      {/* TABLE */}

      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">
              Daftar Pinjaman
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Data pinjaman uang
              BUMDes.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
                placeholder="Cari peminjam..."
                className="pl-9"
              />
            </div>

            <Select
              value={
                statusFilter
              }
              onChange={(
                event,
              ) =>
                setStatusFilter(
                  event.target
                    .value as
                    | "all"
                    | SavingsLoanRecord["status"],
                )
              }
              className="sm:w-44"
            >
              <option value="all">
                Semua Status
              </option>

              <option value="active">
                Aktif
              </option>

              <option value="paid">
                Lunas
              </option>

              <option value="overdue">
                Jatuh Tempo
              </option>
            </Select>
          </div>
        </div>

        {filteredLoans.length ===
        0 ? (
          <EmptyState
            hasFilter={
              Boolean(
                search.trim(),
              ) ||
              statusFilter !==
                "all"
            }
            onAdd={
              openAddForm
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3">
                    Peminjam
                  </th>

                  <th className="px-5 py-3">
                    Tanggal
                  </th>

                  <th className="px-5 py-3">
                    Pinjaman
                  </th>

                  <th className="px-5 py-3">
                    Dibayar
                  </th>

                  <th className="px-5 py-3">
                    Sisa
                  </th>

                  <th className="px-5 py-3">
                    Jatuh Tempo
                  </th>

                  <th className="px-5 py-3">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredLoans.map(
                  (loan) => {
                    const remaining =
                      getRemaining(
                        loan,
                      );

                    return (
                      <tr
                        key={
                          loan.id
                        }
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-5 py-4">
                          <div className="font-medium text-foreground">
                            {
                              loan.borrowerName
                            }
                          </div>

                          <div className="mt-1 text-xs text-muted-foreground">
                            {
                              loan.phone
                            }
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {formatDate(
                            loan.loanDate,
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-foreground">
                          {formatCurrency(
                            loan.loanAmount,
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-foreground">
                          {formatCurrency(
                            loan.totalPaid,
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-foreground">
                          {formatCurrency(
                            remaining,
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {formatDate(
                            loan.dueDate,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusClass(
                              loan.status,
                            )}`}
                          >
                            {getStatusLabel(
                              loan.status,
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() =>
                                openDetail(
                                  loan,
                                )
                              }
                            >
                              <Eye className="size-4" />
                              Detail
                            </Button>

                            {remaining >
                              0 && (
                              <Button
                                type="button"
                                size="sm"
                                className="gap-1.5"
                                onClick={() =>
                                  openPayment(
                                    loan,
                                  )
                                }
                              >
                                <HandCoins className="size-4" />
                                Bayar
                              </Button>
                            )}

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Edit"
                              onClick={() =>
                                openEditForm(
                                  loan,
                                )
                              }
                            >
                              <Pencil className="size-4" />

                              <span className="sr-only">
                                Edit
                              </span>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Hapus"
                              className="text-destructive hover:text-destructive"
                              onClick={() =>
                                openDelete(
                                  loan,
                                )
                              }
                            >
                              <Trash2 className="size-4" />

                              <span className="sr-only">
                                Hapus
                              </span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* ADD / EDIT DIALOG */}
      {/* ================================================== */}

      <Dialog
        open={formOpen}
        onOpenChange={
          setFormOpen
        }
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingLoanId
                ? "Edit Pinjaman"
                : "Tambah Pinjaman"}
            </DialogTitle>

            <DialogDescription>
              Masukkan data pinjaman
              uang dengan lengkap.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={
              handleLoanSubmit
            }
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Nama Peminjam"
                required
              >
                <Input
                  value={
                    loanForm.borrowerName
                  }
                  onChange={(
                    event,
                  ) =>
                    setLoanForm({
                      ...loanForm,
                      borrowerName:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Masukkan nama peminjam"
                />
              </FormField>

              <FormField
                label="No. HP"
                required
              >
                <Input
                  value={
                    loanForm.phone
                  }
                  onChange={(
                    event,
                  ) =>
                    setLoanForm({
                      ...loanForm,
                      phone:
                        event.target
                          .value,
                    })
                  }
                  placeholder="08xxxxxxxxxx"
                  inputMode="tel"
                />
              </FormField>
            </div>

            <FormField
              label="Alamat"
              required
            >
              <Textarea
                value={
                  loanForm.address
                }
                onChange={(
                  event,
                ) =>
                  setLoanForm({
                    ...loanForm,
                    address:
                      event.target
                        .value,
                  })
                }
                placeholder="Masukkan alamat peminjam"
                rows={3}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Tanggal Pinjaman"
                required
              >
                <Input
                  type="date"
                  value={
                    loanForm.loanDate
                  }
                  onChange={(
                    event,
                  ) =>
                    setLoanForm({
                      ...loanForm,
                      loanDate:
                        event.target
                          .value,
                    })
                  }
                />
              </FormField>

              <FormField
                label="Jatuh Tempo"
                required
              >
                <Input
                  type="date"
                  value={
                    loanForm.dueDate
                  }
                  min={
                    loanForm.loanDate ||
                    undefined
                  }
                  onChange={(
                    event,
                  ) =>
                    setLoanForm({
                      ...loanForm,
                      dueDate:
                        event.target
                          .value,
                    })
                  }
                />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Jumlah Pinjaman"
                required
              >
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    loanForm.loanAmount
                  }
                  onChange={(
                    event,
                  ) =>
                    setLoanForm({
                      ...loanForm,
                      loanAmount:
                        event.target
                          .value,
                    })
                  }
                  placeholder="0"
                />
              </FormField>

              <FormField
                label="Nominal Angsuran"
                required
              >
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    loanForm.installmentAmount
                  }
                  onChange={(
                    event,
                  ) =>
                    setLoanForm({
                      ...loanForm,
                      installmentAmount:
                        event.target
                          .value,
                    })
                  }
                  placeholder="0"
                />
              </FormField>
            </div>

            <FormField
              label="Keperluan"
              required
            >
              <Input
                value={
                  loanForm.purpose
                }
                onChange={(
                  event,
                ) =>
                  setLoanForm({
                    ...loanForm,
                    purpose:
                      event.target
                        .value,
                  })
                }
                placeholder="Contoh: Modal usaha"
              />
            </FormField>

            <FormField label="Catatan">
              <Textarea
                value={
                  loanForm.notes
                }
                onChange={(
                  event,
                ) =>
                  setLoanForm({
                    ...loanForm,
                    notes:
                      event.target
                        .value,
                  })
                }
                placeholder="Catatan tambahan jika ada"
                rows={3}
              />
            </FormField>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormOpen(
                    false,
                  )
                }
              >
                Batal
              </Button>

              <Button type="submit">
                {editingLoanId
                  ? "Simpan Perubahan"
                  : "Simpan Pinjaman"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================================================== */}
      {/* DETAIL DIALOG */}
      {/* ================================================== */}

      <Dialog
        open={detailOpen}
        onOpenChange={
          setDetailOpen
        }
      >
        <DialogContent className="max-w-2xl">
          {selectedLoan && (
            <LoanDetail
              loan={
                selectedLoan
              }
              payments={
                savingsLoanPayments
              }
              onPay={() =>
                openPayment(
                  selectedLoan,
                )
              }
              onEdit={() => {
                setDetailOpen(
                  false,
                );
                openEditForm(
                  selectedLoan,
                );
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ================================================== */}
      {/* PAYMENT DIALOG */}
      {/* ================================================== */}

      <Dialog
        open={paymentOpen}
        onOpenChange={
          setPaymentOpen
        }
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Bayar Angsuran
            </DialogTitle>

            <DialogDescription>
              {selectedLoan
                ? `Catat pembayaran untuk ${selectedLoan.borrowerName}.`
                : "Catat pembayaran angsuran."}
            </DialogDescription>
          </DialogHeader>

          {selectedLoan && (
            <form
              onSubmit={
                handlePaymentSubmit
              }
              className="space-y-5"
            >
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Sisa pinjaman
                  </span>

                  <span className="font-semibold text-foreground">
                    {formatCurrency(
                      getRemaining(
                        selectedLoan,
                      ),
                    )}
                  </span>
                </div>
              </div>

              <FormField
                label="Tanggal Pembayaran"
                required
              >
                <Input
                  type="date"
                  value={
                    paymentForm.paymentDate
                  }
                  onChange={(
                    event,
                  ) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentDate:
                        event.target
                          .value,
                    })
                  }
                />
              </FormField>

              <FormField
                label="Nominal Pembayaran"
                required
              >
                <Input
                  type="number"
                  min="0"
                  max={getRemaining(
                    selectedLoan,
                  )}
                  step="0.01"
                  value={
                    paymentForm.amount
                  }
                  onChange={(
                    event,
                  ) =>
                    setPaymentForm({
                      ...paymentForm,
                      amount:
                        event.target
                          .value,
                    })
                  }
                  placeholder={`Maksimal ${formatCurrency(
                    getRemaining(
                      selectedLoan,
                    ),
                  )}`}
                />
              </FormField>

              <FormField label="Catatan">
                <Textarea
                  value={
                    paymentForm.notes
                  }
                  onChange={(
                    event,
                  ) =>
                    setPaymentForm({
                      ...paymentForm,
                      notes:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Catatan pembayaran jika ada"
                  rows={3}
                />
              </FormField>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPaymentOpen(
                      false,
                    )
                  }
                >
                  Batal
                </Button>

                <Button type="submit">
                  Simpan Pembayaran
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ================================================== */}
      {/* DELETE DIALOG */}
      {/* ================================================== */}

      <Dialog
        open={deleteOpen}
        onOpenChange={
          setDeleteOpen
        }
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Hapus Pinjaman?
            </DialogTitle>

            <DialogDescription>
              Data pinjaman
              {deletingLoan
                ? ` ${deletingLoan.borrowerName}`
                : ""}{" "}
              akan dihapus.
              Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Riwayat pembayaran
            yang terkait dengan
            pinjaman ini juga akan
            ikut dihapus.
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setDeleteOpen(
                  false,
                )
              }
            >
              Batal
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={
                handleDelete
              }
            >
              <Trash2 className="size-4" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}

// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-xl font-bold tracking-tight text-foreground">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

// ======================================================
// FORM FIELD
// ======================================================

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}

        {required && (
          <span className="ml-1 text-destructive">
            *
          </span>
        )}
      </Label>

      {children}
    </div>
  );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState({
  hasFilter,
  onAdd,
}: {
  hasFilter: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <HandCoins className="size-5 text-muted-foreground" />
      </div>

      <h3 className="font-semibold text-foreground">
        {hasFilter
          ? "Data tidak ditemukan"
          : "Belum ada data pinjaman"}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasFilter
          ? "Coba ubah kata pencarian atau filter status."
          : "Tambahkan data pinjaman uang untuk mulai mengelola Simpan Pinjam."}
      </p>

      {!hasFilter && (
        <Button
          type="button"
          className="mt-5 gap-2"
          onClick={onAdd}
        >
          <Plus className="size-4" />
          Tambah Pinjaman
        </Button>
      )}
    </div>
  );
}

// ======================================================
// DETAIL
// ======================================================

function LoanDetail({
  loan,
  payments,
  onPay,
  onEdit,
}: {
  loan: SavingsLoanRecord;
  payments: SavingsLoanPayment[];
  onPay: () => void;
  onEdit: () => void;
}) {
  const loanPayments =
    payments
      .filter(
        (payment) =>
          payment.savingsLoanId ===
          loan.id,
      )
      .sort((a, b) =>
        b.paymentDate.localeCompare(
          a.paymentDate,
        ),
      );

  const remaining =
    getRemaining(loan);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Detail Pinjaman
        </DialogTitle>

        <DialogDescription>
          Informasi lengkap pinjaman
          dan riwayat pembayarannya.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        {/* PEMINJAM */}

        <div className="rounded-2xl border p-4">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Informasi Peminjam
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow
              label="Nama"
              value={
                loan.borrowerName
              }
            />

            <InfoRow
              label="No. HP"
              value={
                loan.phone
              }
            />

            <div className="sm:col-span-2">
              <InfoRow
                label="Alamat"
                value={
                  loan.address
                }
              />
            </div>
          </div>
        </div>

        {/* PINJAMAN */}

        <div className="rounded-2xl border p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-foreground">
              Informasi Pinjaman
            </h3>

            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusClass(
                loan.status,
              )}`}
            >
              {getStatusLabel(
                loan.status,
              )}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow
              label="Jumlah Pinjaman"
              value={formatCurrency(
                loan.loanAmount,
              )}
            />

            <InfoRow
              label="Sudah Dibayar"
              value={formatCurrency(
                loan.totalPaid,
              )}
            />

            <InfoRow
              label="Sisa Pinjaman"
              value={formatCurrency(
                remaining,
              )}
            />

            <InfoRow
              label="Nominal Angsuran"
              value={formatCurrency(
                loan.installmentAmount,
              )}
            />

            <InfoRow
              label="Tanggal Pinjaman"
              value={formatDate(
                loan.loanDate,
              )}
            />

            <InfoRow
              label="Jatuh Tempo"
              value={formatDate(
                loan.dueDate,
              )}
            />

            <div className="sm:col-span-2">
              <InfoRow
                label="Keperluan"
                value={
                  loan.purpose
                }
              />
            </div>

            {loan.notes && (
              <div className="sm:col-span-2">
                <InfoRow
                  label="Catatan"
                  value={
                    loan.notes
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* RIWAYAT PEMBAYARAN */}

        <div className="rounded-2xl border">
          <div className="border-b p-4">
            <h3 className="text-sm font-semibold text-foreground">
              Riwayat Pembayaran
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {
                loanPayments.length
              }{" "}
              pembayaran
              tercatat.
            </p>
          </div>

          {loanPayments.length ===
          0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Belum ada pembayaran.
            </div>
          ) : (
            <div className="divide-y">
              {loanPayments.map(
                (payment) => (
                  <div
                    key={
                      payment.id
                    }
                    className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(
                          payment.paymentDate,
                        )}
                      </p>

                      {payment.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {
                            payment.notes
                          }
                        </p>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-emerald-600">
                      +{" "}
                      {formatCurrency(
                        payment.amount,
                      )}
                    </p>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {/* ACTION */}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
          >
            <Pencil className="size-4" />
            Edit
          </Button>

          {remaining > 0 && (
            <Button
              type="button"
              onClick={onPay}
            >
              <HandCoins className="size-4" />
              Bayar Angsuran
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

// ======================================================
// INFO ROW
// ======================================================

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-foreground">
        {value || "-"}
      </p>
    </div>
  );
}
export default SimpanPinjamPage;
SimpanPinjamPage.layout = (page: ReactNode) => <AppShell>{page}</AppShell>;
