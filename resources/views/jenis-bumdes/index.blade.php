@extends('layouts.app')
@section('title', 'Jenis BUMDes')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-foreground">Jenis / Unit BUMDes</h1>
            <p class="mt-1 text-sm text-muted-foreground">Kelola unit usaha BUMDes Desa Wengkal</p>
        </div>
        <button data-modal="modal-tambah-bumdes"
            class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Tambah Unit
        </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @forelse ($bumdesTypes as $type)
            <div class="rounded-2xl border border-border bg-surface p-5 shadow-card hover:shadow-card-hover transition-shadow">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-foreground truncate">{{ $type->name }}</h3>
                        <p class="mt-0.5 text-sm text-muted-foreground">{{ $type->category }}</p>
                    </div>
                    <span class="ml-3 shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        {{ $type->status === 'active' ? 'bg-success-soft text-success' : 'bg-muted text-muted-foreground' }}">
                        {{ $type->status === 'active' ? 'Aktif' : 'Nonaktif' }}
                    </span>
                </div>
                @if ($type->description)
                    <p class="mt-3 text-sm text-muted-foreground line-clamp-2">{{ $type->description }}</p>
                @endif
                <div class="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{{ $type->incomes_count ?? 0 }} pemasukan</span>
                    <span>·</span>
                    <span>{{ $type->expenses_count ?? 0 }} pengeluaran</span>
                </div>
                <div class="mt-4 flex items-center gap-2 border-t border-border pt-4">
                    <a href="{{ route('jenis-bumdes.show', $type->id) }}"
                        class="flex-1 inline-flex justify-center items-center gap-2 rounded-xl border border-input px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
                        Detail
                    </a>
                    <button
                        data-modal="modal-tambah-bumdes"
                        data-edit='@json(["name"=>$type->name,"category"=>$type->category,"description"=>$type->description,"status"=>$type->status])'
                        data-action="{{ route('jenis-bumdes.update', $type->id) }}"
                        class="rounded-xl border border-input p-2 text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors">
                        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </button>
                    <form id="del-bumdes-{{ $type->id }}" method="POST" action="{{ route('jenis-bumdes.destroy', $type->id) }}">
                        @csrf @method('DELETE')
                    </form>
                    <button data-confirm-delete="Yakin hapus unit ini?" data-form="del-bumdes-{{ $type->id }}"
                        class="rounded-xl border border-input p-2 text-muted-foreground hover:text-danger hover:bg-danger-soft transition-colors">
                        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        @empty
            <div class="col-span-3 rounded-2xl border border-border bg-surface p-12 text-center text-muted-foreground shadow-card">
                Belum ada unit usaha BUMDes. Klik "Tambah Unit" untuk memulai.
            </div>
        @endforelse
    </div>
</div>

<div id="modal-tambah-bumdes" class="modal fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="modal-backdrop absolute inset-0 bg-black/50"></div>
    <div class="relative w-full max-w-md rounded-2xl bg-surface shadow-xl">
        <div class="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 class="text-base font-semibold text-foreground">Unit BUMDes</h3>
            <button data-close-modal="modal-tambah-bumdes" class="text-muted-foreground hover:text-foreground">
                <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <form method="POST" action="{{ route('jenis-bumdes.store') }}" data-base-action="{{ route('jenis-bumdes.store') }}">
            @csrf
            <input type="hidden" name="_method" value="POST">
            <div class="space-y-4 px-6 py-5">
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Nama Unit <span class="text-danger">*</span></label>
                    <input type="text" name="name" required placeholder="cth: Unit Perdagangan"
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Kategori <span class="text-danger">*</span></label>
                    <input type="text" name="category" required placeholder="cth: Perdagangan"
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Deskripsi</label>
                    <textarea name="description" rows="3" placeholder="Opsional..."
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Status <span class="text-danger">*</span></label>
                    <select name="status" required
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="active">Aktif</option>
                        <option value="inactive">Nonaktif</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end gap-3 border-t border-border px-6 py-4">
                <button type="button" data-close-modal="modal-tambah-bumdes"
                    class="rounded-xl border border-input px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">Batal</button>
                <button type="submit"
                    class="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">Simpan</button>
            </div>
        </form>
    </div>
</div>
@endsection
