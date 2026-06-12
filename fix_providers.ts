import * as fs from 'fs';

let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const deleteTarget = `onClick={() => {
                                   if (confirm('Delete this provider permanently?')) {
                                      const newProviders = formData.providers.filter(p => p.id !== provider.id);
                                      setFormData({ ...formData, providers: newProviders });
                                   }
                                }}`;
const deleteReplacement = `onClick={async () => {
                                   if (confirm('Delete this provider permanently?')) {
                                      const table = provider.type === 'survey' ? 'survey_providers' : 'offerwall_providers';
                                      const { error } = await supabase.from(table).delete().eq('id', provider.id);
                                      if (error) {
                                          console.error('PROVIDER DELETE ERROR', error);
                                          alert(\`Error deleting provider: \${error.message}\`);
                                      } else {
                                          await refreshSettings();
                                      }
                                   }
                                }}`;

content = content.replace(deleteTarget, deleteReplacement).replace(deleteTarget, deleteReplacement);

const activeTarget = `onClick={() => {
                                  const newProviders = formData.providers.map(p => 
                                    p.id === provider.id ? { ...p, active: !p.active } : p
                                  );
                                  setFormData({ ...formData, providers: newProviders });
                                }}`;

const activeReplacement = `onClick={async () => {
                                  const table = provider.type === 'survey' ? 'survey_providers' : 'offerwall_providers';
                                  const { error } = await supabase.from(table).update({ active: !provider.active }).eq('id', provider.id);
                                  if (error) {
                                      console.error('PROVIDER UPDATE ERROR', error);
                                      alert(\`Error updating provider: \${error.message}\`);
                                  } else {
                                      await refreshSettings();
                                  }
                                }}`;

content = content.replace(activeTarget, activeReplacement).replace(activeTarget, activeReplacement);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
