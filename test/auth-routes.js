const auth = require('../server/routes/auth')

describe('Auth Route - Branch Coverage', () => {
  it('should have login route configuration', () => {
    expect(auth).toBeDefined()
    expect(Array.isArray(auth)).toBe(true)
    expect(auth.length).toBeGreaterThan(0)
  })

  it('login route should exist', () => {
    const loginRoute = auth.find(route => route.path === '/login')
    expect(loginRoute).toBeDefined()
  })

  it('logout route should exist', () => {
    const logoutRoute = auth.find(route => route.path === '/logout')
    expect(logoutRoute).toBeDefined()
  })

  it('logout route should have correct handler', () => {
    const logoutRoute = auth.find(route => route.path === '/logout')
    expect(logoutRoute.options.handler).toBeDefined()
  })

  it('login route should have correct auth', () => {
    const loginRoute = auth.find(route => route.path === '/login')
    expect(loginRoute.options.auth).toBe('azure-legacy')
  })

  it('login route should use GET', () => {
    const loginRoute = auth.find(route => route.path === '/login')
    expect(loginRoute.method).toBe('GET')
  })

  it('logout route should have correct method', () => {
    const logoutRoute = auth.find(route => route.path === '/logout')
    expect(logoutRoute.method).toBe('GET')
  })

  it('should not have duplicate paths', () => {
    const paths = auth.map(route => route.path)
    const uniquePaths = new Set(paths)
    expect(paths.length).toBe(uniquePaths.size)
  })
})

describe('Auth Route Handlers - Unit Tests', () => {
  describe('Login handler', () => {
    let loginHandler
    let mockRequest
    let mockH

    beforeEach(() => {
      const loginRoute = auth.find(route => route.path === '/login')
      loginHandler = loginRoute.options.handler

      mockH = {
        redirect: jest.fn()
      }
    })

    it('should return unauthorized error when authentication fails', () => {
      mockRequest = {
        auth: {
          isAuthenticated: false,
          error: {
            message: 'Invalid credentials'
          }
        }
      }

      const result = loginHandler(mockRequest, mockH)

      expect(result.output.statusCode).toBe(401)
      expect(result.output.payload.message).toContain('Invalid credentials')
    })

    it('should handle missing error message', () => {
      mockRequest = {
        auth: {
          isAuthenticated: false,
          error: null
        }
      }

      const result = loginHandler(mockRequest, mockH)

      expect(result.output.statusCode).toBe(401)
    })

    it('should set cookie auth with admin scope when user has FWISAdmin role', () => {
      mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: {
              id: 'user123',
              email: 'admin@defra.net',
              displayName: 'Admin User',
              raw: {
                roles: '["FWISAdmin"]'
              }
            },
            query: null
          }
        },
        cookieAuth: {
          set: jest.fn()
        }
      }

      loginHandler(mockRequest, mockH)

      expect(mockRequest.cookieAuth.set).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: ['manage:warnings'],
          isAdmin: true,
          roles: ['FWISAdmin']
        })
      )
    })

    it('should set cookie auth without admin scope when user has no FWISAdmin role', () => {
      mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: {
              id: 'user456',
              email: 'user@defra.net',
              displayName: 'Regular User',
              raw: {
                roles: '[]'
              }
            },
            query: null
          }
        },
        cookieAuth: {
          set: jest.fn()
        }
      }

      loginHandler(mockRequest, mockH)

      expect(mockRequest.cookieAuth.set).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: [],
          isAdmin: false,
          roles: []
        })
      )
    })

    it('should redirect to home when no redirectTo query parameter', () => {
      mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: {
              id: 'user123',
              email: 'admin@defra.net',
              displayName: 'Admin User',
              raw: {
                roles: '["FWISAdmin"]'
              }
            },
            query: null
          }
        },
        cookieAuth: {
          set: jest.fn()
        }
      }

      loginHandler(mockRequest, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith('/')
    })

    it('should redirect to redirectTo query parameter when provided', () => {
      const redirectPath = '/target-area/011FWFNC1D'
      mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: {
              id: 'user123',
              email: 'admin@defra.net',
              displayName: 'Admin User',
              raw: {
                roles: '["FWISAdmin"]'
              }
            },
            query: {
              redirectTo: redirectPath
            }
          }
        },
        cookieAuth: {
          set: jest.fn()
        }
      }

      loginHandler(mockRequest, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith(redirectPath)
    })

    it('should handle multiple roles including FWISAdmin', () => {
      mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: {
              id: 'user789',
              email: 'multiuser@defra.net',
              displayName: 'Multi Role User',
              raw: {
                roles: '["Role1","FWISAdmin","Role2"]'
              }
            },
            query: null
          }
        },
        cookieAuth: {
          set: jest.fn()
        }
      }

      loginHandler(mockRequest, mockH)

      expect(mockRequest.cookieAuth.set).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: ['manage:warnings'],
          isAdmin: true
        })
      )
    })

    it('should handle missing profile.raw.roles', () => {
      mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: {
              id: 'user555',
              email: 'user555@defra.net',
              displayName: 'No Roles User',
              raw: {}
            },
            query: null
          }
        },
        cookieAuth: {
          set: jest.fn()
        }
      }

      loginHandler(mockRequest, mockH)

      expect(mockRequest.cookieAuth.set).toHaveBeenCalledWith(
        expect.objectContaining({
          roles: [],
          isAdmin: false
        })
      )
    })
  })

  describe('Logout handler', () => {
    let logoutHandler
    let mockRequest
    let mockH

    beforeEach(() => {
      const logoutRoute = auth.find(route => route.path === '/logout')
      logoutHandler = logoutRoute.options.handler

      mockRequest = {
        cookieAuth: {
          clear: jest.fn()
        }
      }

      mockH = {
        redirect: jest.fn()
      }
    })

    it('should clear cookie authentication', () => {
      logoutHandler(mockRequest, mockH)

      expect(mockRequest.cookieAuth.clear).toHaveBeenCalled()
    })

    it('should redirect to Microsoft logout endpoint', () => {
      logoutHandler(mockRequest, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith(
        expect.stringContaining('login.microsoftonline.com')
      )
    })

    it('should include oauth2 endpoint', () => {
      logoutHandler(mockRequest, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith(
        expect.stringContaining('oauth2/v2.0/logout')
      )
    })

    it('should include post_logout_redirect_uri parameter', () => {
      logoutHandler(mockRequest, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith(
        expect.stringContaining('post_logout_redirect_uri')
      )
    })
  })
})
