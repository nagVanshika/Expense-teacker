# Frontend Development Guidelines

Stack: **React / React Native / Next.js**

AI agents must ensure the UI is **fast, polished, and scalable**.

---

# 1. Folder Structure

Use feature-based architecture.

```
src/
  components/
  features/
  screens/
  hooks/
  services/
  utils/
  constants/
  config/
  styles/
```

Example feature structure

```
features/
   auth/
      components/
      hooks/
      api/
      screens/
```

Rules

* UI components only in `components`
* business logic in hooks
* API calls in services

---

# 2. Component Design Rules

Components must be:

* reusable
* small
* single responsibility

Avoid huge components.

Preferred pattern:

```
Container component
Presentational component
```

---

# 3. API Layer

All API calls must be centralized.

Example

```
services/apiClient.js
services/userService.js
```

Rules

* No API calls inside UI components
* Always use service layer

---

# 4. Loading Experience

Never show blank screens.

Use **Skeleton loaders**.

Example

```
UserCardSkeleton
BookingListSkeleton
DashboardSkeleton
```

Rules

* Skeleton should match layout
* avoid blocking UI

---

# 5. UI Quality (Premium UI)

UI must feel premium.

Mandatory states:

* loading
* empty
* error
* success

Also required:

* consistent spacing
* modern typography
* responsive layout

---

# 6. Animations & Transitions

Animations must be smooth.

Preferred libraries:

React

```
framer-motion
```

React Native

```
react-native-reanimated
```

Guidelines

* duration: 150–300ms
* ease-in-out transitions
* no janky animations

---

# 7. Rendering Optimization

AI must avoid unnecessary renders.

Techniques

```
React.memo
useMemo
useCallback
```

For large lists:

```
FlatList (React Native)
react-window / virtualization (Web)
```

---

# 8. Performance

Mandatory optimizations:

* lazy loading
* code splitting
* dynamic imports

Example

```
const Dashboard = lazy(() => import("./Dashboard"))
```

Images must be optimized.

---

# 9. State Management

Preferred patterns:

Small apps

```
React Context
```

Medium/Large

```
Zustand
Redux Toolkit
React Query
```

Server state must be cached.

---

# 10. Security

AI must check:

* XSS vulnerabilities
* unsafe HTML rendering
* exposed API keys

Never expose secrets in frontend.

Use:

```
.env
```

---

# 11. Accessibility

UI must support:

* keyboard navigation
* aria labels
* proper contrast
* screen readers

---

# 12. Code Quality

AI must ensure:

* no duplicate components
* reusable hooks
* consistent naming
* clean structure

Naming example

```
UserCard.jsx
useAuth.js
bookingService.js
```

---

# 13. Frontend Review Checklist

Before finalizing code AI must verify:

✔ folder structure followed
✔ reusable components created
✔ API calls centralized
✔ skeleton loaders used
✔ animations smooth
✔ no unnecessary renders
✔ optimized images
✔ lazy loading implemented
✔ security checks passed

---

# 14. Development Philosophy

Frontend must prioritize:

* fast rendering
* premium UI
* smooth UX
* maintainable architecture

AI agents must behave like a **senior frontend engineer reviewing production code**.
