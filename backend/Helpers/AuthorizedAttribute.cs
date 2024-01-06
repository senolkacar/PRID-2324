using Microsoft.AspNetCore.Authorization;
using prid_2324.Models;
using System;
using System.Collections.Generic;

namespace prid_2324.Helpers
{
    public class AuthorizedAttribute : AuthorizeAttribute
    {
        public AuthorizedAttribute(params Role[] roles) : base()
        {
            if (roles != null && roles.Length > 0)
            {
                var rolesNames = new List<string>();
                var names = Enum.GetNames(typeof(Role));
                foreach (var role in roles)
                {
                    if ((int)role >= 0 && (int)role < names.Length)
                    {
                        rolesNames.Add(names[(int)role]);
                    }
                }
                Roles = String.Join(",", rolesNames);
            }
        }
    }
}