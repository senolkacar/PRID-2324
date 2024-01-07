using Microsoft.AspNetCore.Authorization;
using prid_2324.Models;
using System;
using System.Collections.Generic;

namespace prid_2324.Helpers
{
    public class AuthorizedAttribute : AuthorizeAttribute
    {
        public AuthorizedAttribute(params Role[] roles) : base() {
        var rolesNames = new List<string>();
            foreach (var role in roles)
            {
                if (Enum.IsDefined(typeof(Role), role))
                {
                    rolesNames.Add(role.ToString());
                }
            }
            Roles = String.Join(",", rolesNames);
        }
    }
}